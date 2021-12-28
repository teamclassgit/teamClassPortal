// @packages
import { isUserLoggedIn } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef, useMemo } from 'react';

// @scripts
import ConversationContainer from './ConversationsContainer';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import queryConversationsDetail from '../../graphql/QueryConversationsDetail';
import { getToken, getConversationParticipants } from './Apis';
import { getUserData } from '../../utility/Utils';
import { handlePromiseRejection } from './helpers';
import {
  addMessages,
  addNotifications,
  endTyping,
  informationId,
  listConversations,
  login,
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
  const Conversations = require("@twilio/conversations");
  const [client, setClient] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);
  const [infoDetails, setInfoDetails] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const conversations = useSelector((state) => state.reducer.convo.convo);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const id = useSelector((state) => state.reducer.information.info);

  const sidRef = useRef("");
  const IdRef = useRef("");
  sidRef.current = sid;
  IdRef.current = id;

  const dispatch = useDispatch();

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2Q3OGNkYmU3MjExY2M5NGFiYzU0MTZjNGNlNTUxNjFhLTE2NDA2OTcyNzIiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJEaWVnbzEyMzQiLCJjaGF0Ijp7InNlcnZpY2Vfc2lkIjoiSVNkMWUzNTExMzA5OWU0ZmJhOTZiMzVhOTIxYjBjYzhjNCJ9fSwiaWF0IjoxNjQwNjk3MjcyLCJleHAiOjE2NDA3MDA4NzIsImlzcyI6IlNLZDc4Y2RiZTcyMTFjYzk0YWJjNTQxNmM0Y2U1NTE2MWEiLCJzdWIiOiJBQzU5Nzk2OGFlYWQyZTY1Y2UyZWYyMGM4M2Y4YjE4ZmJhIn0.13CroGFdJG9GYBRMUaTKIi53H0LOVC3FE4S0Q46wAwc";
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

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

  useEffect(() => {
    Conversations.Client.create(token).then((client) => {
      setClient(client);
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
      client.addListener("conversationUpdated", ({ conversation }) => {
        handlePromiseRejection(() => updateConvoList(
          client,
          conversation,
          listConversations,
          addMessages,
          updateUnreadMessages
        ), dispatch(addNotifications));
      });
      
      client.addListener("messageUpdated", ({ message }) => {
        handlePromiseRejection(() => updateConvoList(
          client,
          message.conversation,
          listConversations,
          addMessages,
          updateUnreadMessages
        ), dispatch(addNotifications));
      });

      client.addListener("messageRemoved", (message) => {
        handlePromiseRejection(() => dispatch(removeMessages(
          message.conversation.sid, [message]
        ), dispatch(addNotifications)));
      });

      client.addListener("tokenExpired", () => {
        if (username && password) {
          getToken(username, password).then((token) => {
            login(token);
          });
        }
      });

      dispatch(updateLoadingState(false));
    });

    return () => {
      client?.removeAllListeners();
    };
  }, [client]);

  const addMessage = async (message, addMessages, updateUnreadMessages) => {
    handlePromiseRejection(() => {
      if (sidRef.current === message.conversation.sid) {
        message.conversation.updateLastReadMessageIndex(message.index);
      }
      dispatch(addMessages(message.conversation.sid, [message]));
      loadUnreadMessagesCount(message.conversation, updateUnreadMessages);
    }, dispatch(addNotifications));
  };

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData()?.customData);
    }
  }, []);

  useQuery(queryConversationsDetail, {
    fetchPolicy: 'no-cache',
    variables: {
      bookingIds: conversations.map((convo) => convo?.friendlyName),
      userId: userData?._id,
      searchText: inputValue,
      limit: 10
    },
    onCompleted: (data) => {
      setInfoDetails(data.getConversationsDetails);
    },
    pollInterval: 20000
  });

  const openedConversation = useMemo(
    () => conversations?.find((convo) => convo?.sid === sid),
    [conversations, sid]
  );

  const openedConversationInfo = useMemo(
    () => infoDetails?.find((convo) => convo?.sid === sid),
    [infoDetails, sid]
  );

  const openedNotConversations = useMemo(
    () => infoDetails?.find((convo) => convo?._id === id),
    [infoDetails, sid]
  );


  if (client === null || client === undefined) {
    return null;
  } 

  return (
    <>
      <SidebarLeft
        client={client}
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        infoDetails={infoDetails}
        inputValue={inputValue}
        setInfoDetails={setInfoDetails}
        setInputValue={setInputValue}
        sidebar={sidebar}
        userData={userData}
        userSidebarLeft={userSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            {client?.connectionState !== "denied" && (
              <ConversationContainer
                client={client}
                info={infoDetails}
                conversation={openedConversation}
                openedNotConversations={openedNotConversations}
                openedConversationInfo={openedConversationInfo}
              />
            )}
          </div>
        </div>
      </div>
      {sid && openedConversation && client && (
        <SidebarRight 
          conversation={openedConversation}
        />
      )}
    </>
  );
};

export default AppChat;
