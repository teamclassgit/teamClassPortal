// @packages
import classnames from 'classnames';
import { isUserLoggedIn } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { useState, useEffect, useRef, useMemo } from 'react';

// @scripts
import Chat from './Chat';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import queryAllMessageInteraction from '../../graphql/QueryAllMessageInteraction';
import { getToken, getConversationParticipants } from './Apis';
import { getUserData } from '../../utility/Utils';
import { handlePromiseRejection } from './helpers';
import {
  addMessages,
  addNotifications,
  endTyping,
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
import '@styles/base/pages/app-chat.scss';
import '@styles/base/pages/app-chat-list.scss';

const AppChat = () => {
  const Conversations = require("@twilio/conversations");
  const [client, setClient] = useState(null);
  const [messageInfo, setMessageInfo] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);

  const conversations = useSelector((state) => state.reducer.convo.convo);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const store = useSelector((state) => state.reducer.chats);

  const sidRef = useRef("");
  sidRef.current = sid;

  const dispatch = useDispatch();

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2Q3OGNkYmU3MjExY2M5NGFiYzU0MTZjNGNlNTUxNjFhLTE2Mzk2NzMzOTIiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJEaWVnbzEyMyIsImNoYXQiOnsic2VydmljZV9zaWQiOiJJU2QxZTM1MTEzMDk5ZTRmYmE5NmIzNWE5MjFiMGNjOGM0In19LCJpYXQiOjE2Mzk2NzMzOTIsImV4cCI6MTYzOTY3Njk5MiwiaXNzIjoiU0tkNzhjZGJlNzIxMWNjOTRhYmM1NDE2YzRjZTU1MTYxYSIsInN1YiI6IkFDNTk3OTY4YWVhZDJlNjVjZTJlZjIwYzgzZjhiMThmYmEifQ.vBaBvDS6ceHTarhQZWAPXmyOOCi8rvXqWhSvSbv5q7g";
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
        debugger;
        dispatch(updateCurrentConversation(""));
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
  }, []);

  const addMessage = async (message, addMessages, updateUnreadMessages) => {
    handlePromiseRejection(() => {
      if (sidRef.current === message.conversation.sid) {
        message.conversation.updateLastReadMessageIndex(message.index);
      }
      dispatch(addMessages(message.conversation.sid, [message]));
      loadUnreadMessagesCount(message.conversation, updateUnreadMessages);
    }, dispatch(addNotifications));
  };

  const openedConversation = useMemo(
    () => conversations.find((convo) => convo.sid === sid),
    [conversations, sid]
  );

  const { ...allMessageInteractionResults } = useQuery(queryAllMessageInteraction, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: store
    },
    pollInterval: 5000
  });

  useEffect(() => {
    if (allMessageInteractionResults.data) {
      setMessageInfo(allMessageInteractionResults.data.messageInteractions.filter((message) => message.toId === userData?._id));
    }
  }, [allMessageInteractionResults.data]);

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(getUserData()?.customData);
    }
  }, []);

  return (
    <>
      <SidebarLeft
        client={client}
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        sidebar={sidebar}
        userData={userData}
        userSidebarLeft={userSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <Chat
              client={client} 
              openedConversation={openedConversation}
            />
          </div>
        </div>
      </div>
      <SidebarRight
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        messageInfo={messageInfo}
        setMessageInfo={setMessageInfo}
        sidebar={sidebar}
        store={store}
        userData={userData}
        userSidebarLeft={userSidebarLeft}
      />
    </>
  );
};

export default AppChat;
