// @packages
import classnames from 'classnames';
import { isUserLoggedIn } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { getToken } from './Apis';
import { useState, useEffect, useRef, useMemo } from 'react';

// @scripts
import Chat from './Chat';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import UserProfileSidebar from './UserProfileSidebar';
import queryAllMessageInteraction from '../../graphql/QueryAllMessageInteraction';
import { getUserData } from '../../utility/Utils';
import { handlePromiseRejection } from './helpers';
import {
  addMessages,
  addNotifications,
  endTyping,
  getChatContacts,
  getUserProfile,
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
  const [userData, setUserData] = useState(null);

  const conversations = useSelector((state) => state.reducer.convo.convo);
  const sid = useSelector((state) => state.reducer.sid);
  const store = useSelector((state) => state.reducer.chats);

  const sidRef = useRef("");
  sidRef.current = sid;

  const dispatch = useDispatch();

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2Q3OGNkYmU3MjExY2M5NGFiYzU0MTZjNGNlNTUxNjFhLTE2Mzk0MTAxMzEiLCJncmFudHMiOnsiaWRlbnRpdHkiOiJEaWVnbzEyMyIsImNoYXQiOnsic2VydmljZV9zaWQiOiJJU2QxZTM1MTEzMDk5ZTRmYmE5NmIzNWE5MjFiMGNjOGM0In19LCJpYXQiOjE2Mzk0MTAxMzEsImV4cCI6MTYzOTQxMzczMSwiaXNzIjoiU0tkNzhjZGJlNzIxMWNjOTRhYmM1NDE2YzRjZTU1MTYxYSIsInN1YiI6IkFDNTk3OTY4YWVhZDJlNjVjZTJlZjIwYzgzZjhiMThmYmEifQ.2oKt9miIFscTEQBviqpmb6mLt731hVD9cDfNa2SR1N8";
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  async function loadUnreadMessagesCount (convo, updateUnreadMessages) {
    const count = await convo.getUnreadMessagesCount();
    dispatch(updateUnreadMessages(convo.sid, count));
  }
  
  async function handleParticipantsUpdate (participant, updateParticipants) {
    const result = await getConversationParticipants(participant.conversation);
    dispatch(updateParticipants(participant.conversation.sid, result));
  }
  
  async function updateConvoList (client, conversation, setConvos, addMessages, updateUnreadMessages) {
    if (conversation.status === "joined") {
      const messages = await conversation.getMessages();
      dispatch(addMessages(conversation.sid, messages));
    } else {
      dispatch(addMessages(conversation.sid, []));
    }
  
    loadUnreadMessagesCount(conversation, updateUnreadMessages);
  
    const subscribedConversations = await client.getSubscribedConversations();
    dispatch(listConversations(subscribedConversations.items));
  }

  useEffect(() => {
    Conversations.Client.create(token).then((client) => {
      setClient(client);
      client.addListener("conversationAdded", async (conversation) => {
        conversation.addListener("typingStarted", (participant) => {
          handlePromiseRejection(() => dispatch(updateTypingIndicator(participant, conversation.sid, startTyping)), addNotifications);
        });

        conversation.addListener("typingEnded", (participant) => {
          handlePromiseRejection(() => dispatch(updateTypingIndicator(participant, conversation.sid, endTyping)), addNotifications);
        });

        handlePromiseRejection(async () => {
          if (conversation.status === "joined") {
            const result = await getConversationParticipants(conversation);
            dispatch(updateParticipants(result, conversation.sid));
          }

          updateConvoList(
            client,
            conversation,
            listConversations,
            addMessages,
            updateUnreadMessages
          );
        }, addNotifications);
      });

      client.addListener("conversationRemoved", (conversation) => {
        updateCurrentConversation("");
        handlePromiseRejection(() => {
          dispatch(removeConversation(conversation.sid));
          dispatch(updateParticipants([], conversation.sid));
        }, addNotifications);
      });
      client.addListener("messageAdded", (event) => {
        dispatch(addMessage(event, addMessages, updateUnreadMessages));
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
        handlePromiseRejection(() => removeMessages(
          message.conversation.sid, [message]
        ), addNotifications);
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

  function addMessage (message, addMessages, updateUnreadMessages) {
    handlePromiseRejection(() => {
      if (sidRef.current === message.conversation.sid) {
        message.conversation.updateLastReadMessageIndex(message.index);
      }
      addMessages(message.conversation.sid, [message]);
      loadUnreadMessagesCount(message.conversation, updateUnreadMessages);
    }, addNotifications);
  }

  const updateTypingIndicator = (participant, sid) => {
    const { attributes: { friendlyName }, identity } = participant;
    if (identity === localStorage.getItem("username")) {
      return;
    }
    callback(
      sid,
      identity || friendlyName || ""
    );
  };

  // const openedConversation = useMemo(
  //   () => conversations.find((convo) => convo?.sid === sid),
  //   [sid, conversations]
  // );

  console.log(conversations.find((convo) => convo?.sid === sid));
  useEffect(() => {
    dispatch(getChatContacts());
    dispatch(getUserProfile());
  }, []);

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

  const [user, setUser] = useState({});
  const [sidebar, setSidebar] = useState(false);
  const [userSidebarRight, setUserSidebarRight] = useState(false);
  const [userSidebarLeft, setUserSidebarLeft] = useState(false);

  const handleSidebar = () => setSidebar(!sidebar);
  const handleUserSidebarLeft = () => setUserSidebarLeft(!userSidebarLeft);
  const handleUserSidebarRight = () => setUserSidebarRight(!userSidebarRight);
  const handleOverlayClick = () => {
    setSidebar(false);
    setUserSidebarRight(false);
    setUserSidebarLeft(false);
  };

  const handleUser = obj => setUser(obj);

  return (
    <>
      <SidebarLeft
        handleSidebar={handleSidebar}
        handleUserSidebarLeft={handleUserSidebarLeft}
        messageInfo={messageInfo}
        setMessageInfo={setMessageInfo}
        sidebar={sidebar}
        store={store}
        userData={userData}
        userSidebarLeft={userSidebarLeft}
      />
      <div className='content-right'>
        <div className='content-wrapper'>
          <div className='content-body'>
            <div
              className={classnames('body-content-overlay', {
                show: userSidebarRight === true || sidebar === true || userSidebarLeft === true
              })}
              onClick={handleOverlayClick}
            ></div>
            <Chat
              store={store}
              handleUser={handleUser}
              handleSidebar={handleSidebar}
              userSidebarLeft={userSidebarLeft}
              handleUserSidebarRight={handleUserSidebarRight}
            />
            <UserProfileSidebar
              user={user}
              userSidebarRight={userSidebarRight}
              handleUserSidebarRight={handleUserSidebarRight}
            />
          </div>
        </div>
      </div>
      <SidebarRight
        store={store}
        userData={userData}
        sidebar={sidebar}
        messageInfo={messageInfo}
        setMessageInfo={setMessageInfo}
        handleSidebar={handleSidebar}
        userSidebarLeft={userSidebarLeft}
        handleUserSidebarLeft={handleUserSidebarLeft}
      />
    </>
  );
};

export default AppChat;
