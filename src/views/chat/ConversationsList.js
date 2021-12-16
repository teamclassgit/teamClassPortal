// @packages
import { useDispatch, useSelector } from "react-redux";

// @scripts 
import ConversationView from "./ConversationsView";
import { unexpectedErrorNotification} from './helpers';
import {
  addNotifications,
  setLastReadIndex,
  updateCurrentConversation,
  updateParticipants,
  updateUnreadMessages
} from '../../redux/actions/chat';

const ConversationsList = () => {
  const conversations = useSelector((state) => state.reducer.convo.convo);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const typingData = useSelector((state) => state.reducer.typingData.typingData);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages.unreadMessages);

  const dispatch = useDispatch();

  if (conversations === undefined || conversations === null) {
    return <div className="empty" />;
  }

  const updateCurrentConvo = async (updateCurrentConvo, convo, updateParticipants) => {
    dispatch(updateCurrentConvo(convo.sid));
  
    try {
      const participants = await convo.getParticipants();
      dispatch(updateParticipants(participants, convo.sid));
    } catch (e) {
      return Promise.reject('Error getting participants');
    }
  };

  const setUnreadMessagesCount = (
    currentconvoSid,
    convoSid,
    unreadMessages,
    updateUnreadMessages
  ) => {
    if (currentconvoSid === convoSid && unreadMessages[convoSid] !== 0) {
      dispatch(updateUnreadMessages(convoSid, 0));
      return 0;
    }
    if (currentconvoSid === convoSid) {
      return 0;
    }
    return unreadMessages[convoSid];
  };

  const isMyMessage = (messages) => {
    if (messages === undefined || messages === null || messages.length === 0) {
      return false;
    }
    return messages[messages.length - 1].author ===
      localStorage.getItem("username")
      ? messages[messages.length - 1]
      : false;
  };

  const getLastMessage = (messages, typingData) => {
    if (messages === undefined || messages === null) {
      return "Loading...";
    }
    if (typingData.length) {
      return getTypingMessage(typingData);
    }
    if (messages.length === 0) {
      return "No messages";
    }
    if (!!messages[messages.length - 1].media) {
      return "Media message";
    }
    return messages[messages.length - 1].body;
  };

  if (messages === undefined || messages === null) { 
    return <div className="empty" />;
  }

  return (
    <div id="conversation-list">
      {conversations?.map((convo) => (
        <ConversationView
          key={convo.sid}
          convoId={convo.sid}
          setSid={dispatch(updateCurrentConversation)}
          currentConvoSid={sid}
          lastMessage={getLastMessage(
            messages[convo?.sid] ?? [],
            typingData[convo?.sid] ?? []
          )}
          messages={messages[convo.sid]}
          typingInfo={typingData[convo.sid] ?? []}
          myMessage={isMyMessage(messages[convo.sid])}
          unreadMessagesCount={setUnreadMessagesCount(
            sid,
            convo.sid,
            unreadMessages,
            updateUnreadMessages
          )}
          updateUnreadMessages={updateUnreadMessages}
          participants={participants[convo.sid] ?? []}
          convo={convo}
          onClick={async () => {
            try {
              dispatch(setLastReadIndex(convo.lastReadMessageIndex ?? -1));
              await updateCurrentConvo(
                updateCurrentConversation,
                convo,
                updateParticipants
              );
              dispatch(updateUnreadMessages(convo.sid, 0));
            } catch (e) {
              unexpectedErrorNotification(addNotifications);
              console.log(e);
            }
          }}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
