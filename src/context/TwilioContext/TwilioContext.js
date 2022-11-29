/* eslint-disable no-undef */
// @packages
import { Client } from "@twilio/conversations";
import { useMutation } from "@apollo/client";
import { createContext, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apolloClient } from "../../utility/RealmApolloClient";
// @scripts
import mutationTokenConversations from "../../graphql/MutationTokenConversations";
import { handlePromiseRejection } from "../../views/chat/helpers";
import { getConversationParticipants } from "../../views/chat/Apis";
import {
  addMessages,
  addConversation,
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
  updateUnreadMessages,
  setTotalUnreadMessagesCount,
  cleanUnreadMessages
} from "../../redux/actions/chat";

export const TwilioContext = createContext();

const TwilioClientContextProvider = (props) => {
  const { userData } = props;
  const [chatUser, setChatUser] = useState(userData);
  const [updateTokenConversations] = useMutation(mutationTokenConversations);
  const [twilioClient, setTwilioClient] = useState(null);
  const [totalUnread, setTotalUnread] = useState({});
  const dispatch = useDispatch();
  const sid = useSelector((state) => state.reducer.sid.sid);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages.unreadMessages);
  const sidRef = useRef("");
  sidRef.current = sid;

  const getToken = async () => {
    const tokenInfo = await updateTokenConversations({
      variables: {
        identity: chatUser?.email
      }
    });

    return tokenInfo?.data?.creatingAccessTokenTwilio?.token;
  };

  const setupTwilioClient = async () => {
    try {
      const newToken = await getToken();
      if (!newToken) {
        console.log("Token can't be created/updated ", error);
        return;
      }
      const clientOptions = { logLevel: "debug" };
      const client = new Client(newToken);
      setTwilioClient(client);
      client.on("stateChanged", (state) => {
        console.log(state);
        if (state === "initialized") {
        }
      });

      client.on("conversationAdded", async (conversation) => {
        conversation.on("typingStarted", (participant) => {
          handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, startTyping), addNotifications);
        });

        conversation.on("typingEnded", (participant) => {
          handlePromiseRejection(() => updateTypingIndicator(participant, conversation.sid, endTyping), addNotifications);
        });

        handlePromiseRejection(async () => {
          if (conversation.status === "joined") {
            const result = await getConversationParticipants();
            dispatch(updateParticipants(result, conversation.sid));
          }

          updateConvoList("conversationAdded", client, conversation, listConversations, addMessages, updateUnreadMessages);
        }, dispatch(addNotifications));
      });

      client.on("conversationRemoved", (conversation) => {
        dispatch(updateCurrentConversation(""));
        dispatch(informationId(""));
        handlePromiseRejection(() => {
          dispatch(removeConversation(conversation.sid));
          dispatch(updateParticipants([], conversation.sid));
        }, dispatch(addNotifications));
      });

      client.on("conversationUpdated", async ({ conversation, updateReasons }) => {
        handlePromiseRejection(
          () => updateConvoList("conversationUpdated", client, conversation, listConversations, addMessages, updateUnreadMessages),
          addNotifications
        );
      });

      client.on("messageAdded", (event) => {
        addMessage(event, addMessages, updateUnreadMessages);
      });

      client.on("participantLeft", (participant) => {
        handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
      });

      client.on("participantUpdated", (event) => {
        handlePromiseRejection(() => handleParticipantsUpdate(event.participant, updateParticipants), addNotifications);
      });

      client.on("participantJoined", (participant) => {
        handlePromiseRejection(() => handleParticipantsUpdate(participant, updateParticipants), addNotifications);
      });

      client.on("messageUpdated", ({ message }) => {
        handlePromiseRejection(
          () => updateConvoList("messageUpdated", client, message.conversation, listConversations, addMessages, updateUnreadMessages),
          addNotifications
        );
      });

      client.on("messageRemoved", (message) => {
        handlePromiseRejection(() => removeMessagesUpdate(message.conversation.sid, message, dispatch, removeMessages), addNotifications);
      });

      client.on("tokenExpired", async () => {
        console.log("token expired");
        client.updateToken(await getToken());
      });

      client.on("tokenAboutToExpire", async () => {
        console.log("tokenExpired");
        client.updateToken(await getToken());
      });

      dispatch(updateLoadingState(false));
    } catch (error) {
      console.log("Token can't be created/updated ", error);
    }
  };

  const updateConvoList = async (eventName, client, conversation, listConversations, addMessages, updateUnreadMessages) => {
    loadUnreadMessagesCount(conversation, updateUnreadMessages);
    dispatch(addConversation(conversation));
  };

  const updateTypingIndicator = (participant, sid, callback) => {
    const {
      attributes: { friendlyName },
      identity
    } = participant;
    if (identity === chatUser?.email) {
      return;
    }
    callback(sid, identity || friendlyName || "");
  };

  const removeMessagesUpdate = (convo, messages, dispatch, removeMessages) => {
    dispatch(removeMessages(convo, [messages]));
  };

  const loadUnreadMessagesCount = async (convo, updateUnreadMessages) => {
    const count = await convo.getUnreadMessagesCount();
    dispatch(updateUnreadMessages(convo.sid, count ?? 0));
  };

  const addMessage = async (message, addMessages, updateUnreadMessages) => {
    handlePromiseRejection(() => {
      if (sidRef?.current === message?.conversation?.sid) {
        message?.conversation?.updateLastReadMessageIndex(message?.index);
      }
      dispatch(addMessages(message?.conversation?.sid, [message]));
      loadUnreadMessagesCount(message?.conversation, updateUnreadMessages);
    }, dispatch(addNotifications));
  };

  const handleParticipantsUpdate = async (participant, updateParticipants) => {
    const result = await getConversationParticipants(participant.conversation);
    dispatch(updateParticipants(result, participant.conversation.sid));
  };

  useEffect(() => {
    dispatch(cleanUnreadMessages());

    if (apolloClient && chatUser) setupTwilioClient();
    else setTwilioClient(null);

    return () => {
      twilioClient?.removeAllListeners();
    };
  }, [chatUser]);

  useEffect(() => {
    let totalUnreadMessages = 0;
    Object.keys(unreadMessages).forEach((key) => {
      totalUnreadMessages += unreadMessages[key];
    });
    dispatch(setTotalUnreadMessagesCount(totalUnreadMessages));
    setTotalUnread(totalUnreadMessages);
  }, [unreadMessages]);

  return <TwilioContext.Provider value={{ twilioClient, totalUnread, setChatUser }}>{props.children}</TwilioContext.Provider>;
};

export default TwilioClientContextProvider;
