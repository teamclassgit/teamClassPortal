// @packages
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';

// @scripts
import ConversationContainer from './ConversationsContainer';
import mutationTokenConversations from '../../graphql/MutationTokenConversations';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import useTwilioClient from '../../@core/hooks/useTwilioClient';
import { getConversationParticipants } from './Apis';
import { handlePromiseRejection } from './helpers';
import {
  addMessages,
  addNotifications,
  endTyping,
  informationId,
  listConversations,
  removeConversation,
  removeMessages,
  startTyping,
  updateCurrentConversation,
  updateLoadingState,
  updateParticipants,
  updateUnreadMessages
} from '../../redux/actions/chat';

// @styles
import '@styles/base/pages/app-chat-list.scss';
import '@styles/base/pages/app-chat.scss';

const AppChat = () => {
  const [sidebar, setSidebar] = useState(false);
  const [status, setStatus] = useState('online');
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);

  const { 
    client,
    data,
    conversations,
    inputValue,
    setInputValue,
    isInfoReady,
    userData
  } = useTwilioClient();

  const [updateTokenConversations] = useMutation(mutationTokenConversations);

  const id = useSelector((state) => state.reducer.information.info);
  const sid = useSelector((state) => state.reducer.sid.sid);

  const sidRef = useRef("");
  const IdRef = useRef("");
  sidRef.current = sid;
  IdRef.current = id;

  const dispatch = useDispatch();

  const handleSidebar = () => setSidebar(!sidebar);
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);

  const updateTypingIndicator = (participant, sid, callback) => {
    const { attributes: { friendlyName }, identity } = participant;
    if (identity === localStorage.getItem("username")) {
      return;
    }
    callback(
      sid,
      identity || friendlyName || ""
    );
  };

  const loadUnreadMessagesCount = async (convo, updateUnreadMessages) => {
    const count = await convo.getUnreadMessagesCount();
    dispatch(updateUnreadMessages(convo.sid, count ?? 0));
  };

  const removeMessagesUpdate = (convo, messages, dispatch, removeMessages) => {
    dispatch(removeMessages(convo, [messages]));
  };
  
  const handleParticipantsUpdate = async (participant, updateParticipants) => {
    const result = await getConversationParticipants(participant.conversation);
    dispatch(updateParticipants(result, participant.conversation.sid));
  };

  const updateConvoList = async (
    client,
    conversation,
    listConversations,
    addMessages,
    updateUnreadMessages
  ) => {
    if (conversation.status === "joined") {
      const messages = await conversation.getMessages();
      dispatch(addMessages(conversation.sid, messages.items));
    } else {
      dispatch(addMessages(conversation.sid, []));
    }
  
    loadUnreadMessagesCount(conversation, updateUnreadMessages);
  
    const subscribedConversations = await client.getSubscribedConversations();
    
    dispatch(listConversations(subscribedConversations.items));
  };

  const updateConversations = async (client) => {
    if (client) {
      const conversations = await client?.getSubscribedConversations();
      dispatch(listConversations(conversations?.items ?? []));
    }
  };

  const updateToken = async () => {
    try {
      const newToken = await updateTokenConversations({
        variables: {
          identity: userDataEmail
        }
      });
      setToken(newToken?.data?.creatingAccessTokenTwilio?.token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (client) {
      client.on('stateChanged', (state) => {
        if (state === 'initialized') {
          updateConversations(client);
          client.addListener("conversationAdded", async (conversation) => {
            conversation.addListener("typingStarted", (participant) => {
              handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, startTyping), addNotifications);
            });

            conversation.addListener("typingEnded", (participant) => {
              handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, endTyping), addNotifications);
            });

            handlePromiseRejection(async () => {
              if (conversation.status === "joined") {
                const result = await getConversationParticipants();
                dispatch(updateParticipants(result, conversation.sid));
              }

              updateConvoList(
                client,
                conversation,
                listConversations,
                addMessages,
                updateUnreadMessages
              );
            }, dispatch(addNotifications));
          });

          client.addListener("conversationRemoved", (conversation) => {
            dispatch(updateCurrentConversation(""));
            dispatch(informationId(""));
            handlePromiseRejection(() => {
              dispatch(removeConversation(conversation.sid));
              dispatch(updateParticipants([], conversation.sid));
            }, dispatch(addNotifications));
          });

          client.addListener("messageAdded", (event) => {
            addMessage(event, addMessages, updateUnreadMessages);
          });

          client.addListener("participantLeft", (participant) => {
            handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
          });

          client.addListener("participantUpdated", (event) => {
            handlePromiseRejection(() => handleParticipantsUpdate(event.participant, updateParticipants), addNotifications);
          });

          client.addListener("participantJoined", (participant) => {
            handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
          });

          client.addListener("conversationUpdated", async ({ conversation }) => {
            handlePromiseRejection(() => updateConvoList(
              client,
              conversation,
              listConversations,
              addMessages,
              updateUnreadMessages
            ), addNotifications);
          });

          client.addListener("messageUpdated", ({ message }) => {
            handlePromiseRejection(() => updateConvoList(
              client,
              message.conversation,
              listConversations,
              addMessages,
              updateUnreadMessages
            ), addNotifications);
          });

          client.addListener("messageRemoved", (message) => {
            handlePromiseRejection(() => removeMessagesUpdate(
              message.conversation.sid,
              message,
              dispatch,
              removeMessages
            ), addNotifications);
          });

          client.addListener("tokenExpired", () => {
            updateToken();
          });

          client.addListener("tokenAboutToExpire", () => {
            updateToken();
          });  

          dispatch(updateLoadingState(false));
        }
      });

      return () => {
        client?.removeAllListeners();
      };
    }

  }, [client]);

  const addMessage = async (message, addMessages, updateUnreadMessages) => {
    handlePromiseRejection(() => {
      if (sidRef.current === message?.conversation?.sid) {
        message?.conversation?.updateLastReadMessageIndex(message?.index);
      }
      dispatch(addMessages(message?.conversation?.sid, [message]));
      loadUnreadMessagesCount(message?.conversation, updateUnreadMessages);
    }, dispatch(addNotifications));
  };

  const openedConversation = useMemo(
    () => conversations?.find((convo) => convo?.sid === sid),
    [conversations, sid]
  );

  const openedConversationInfo = useMemo(
    () => data?.find((convo) => convo?.sid === sid),
    [data, sid]
  );

  const openedNotConversations = useMemo(
    () => data?.find((convo) => convo?._id === id),
    [data, id]
  );

  if (client === null || client === undefined) {
    return null;
  } 

  console.log("id", id);

  return (
    <>
      <SidebarLeft
        client={client}
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        infoDetails={data}
        inputValue={inputValue}
        isInfoReady={isInfoReady}
        status={status}
        setStatus={setStatus}
        setInputValue={setInputValue}
        sidebar={sidebar}
        userData={userData}
        userSidebarLeft={userSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <ConversationContainer
              client={client}
              userData={userData}
              status={status}
              conversation={openedConversation}
              info={data}
              openedConversationInfo={openedConversationInfo}
              openedNotConversations={openedNotConversations}
            />
          </div>
        </div>
      </div>
      {sid && openedConversation && client && (
        <SidebarRight 
          client={client}
          id={id}
        />
      )}
    </>
  );
};

export default AppChat;