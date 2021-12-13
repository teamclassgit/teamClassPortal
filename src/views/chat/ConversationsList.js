import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import ConversationView from "./ConversationsView";
import * as chat from '../../redux/actions/chat';
import { unexpectedErrorNotification} from './helpers';

function getLastMessage (messages, typingData) {
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
}

function isMyMessage (messages) {
  if (messages === undefined || messages === null || messages.length === 0) {
    return false;
  }
  return messages[messages.length - 1].author ===
    localStorage.getItem("username")
    ? messages[messages.length - 1]
    : false;
}

async function updateCurrentConvo (
  setSid,
  convo,
  updateParticipants
) {
  setSid(convo.sid);

  try {
    const participants = await convo.getParticipants();
    updateParticipants(participants, convo.sid);
  } catch {
    return Promise.reject(UNEXPECTED_ERROR_MESSAGE);
  }
}

function setUnreadMessagesCount (
  currentconvoSid,
  convoSid,
  unreadMessages,
  updateUnreadMessages
) {
  if (currentconvoSid === convoSid && unreadMessages[convoSid] !== 0) {
    updateUnreadMessages(convoSid, 0);
    return 0;
  }
  if (currentconvoSid === convoSid) {
    return 0;
  }
  return unreadMessages[convoSid];
}

const ConversationsList = () => {
  const sid = useSelector((state) => state.reducer.sid);
  const conversations = useSelector((state) => state.reducer.convo);
  const messages = useSelector((state) => state.reducer.messages);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages);
  const participants = useSelector((state) => state.reducer.participants);
  const typingData = useSelector((state) => state.reducer.typingData);

  const dispatch = useDispatch();
  const {
    updateCurrentConversation,
    updateParticipants,
    updateUnreadMessages,
    setLastReadIndex,
    addNotifications
  } = bindActionCreators(chat, dispatch);

  if (conversations === undefined || conversations === null) {
    return <div className="empty" />;
  }

  return (
    <div id="conversation-list">
      {conversations?.convo.map((convo) => (
        <ConversationView
          key={convo.sid}
          convoId={convo.sid}
          setSid={updateCurrentConversation}
          currentConvoSid={sid}
          lastMessage={getLastMessage(
            messages[convo.sid],
            typingData[convo.sid] ?? []
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
              setLastReadIndex(convo.lastReadMessageIndex ?? -1);
              await updateCurrentConvo(
                updateCurrentConversation,
                convo,
                updateParticipants
              );
              updateUnreadMessages(convo.sid, 0);
              const lastMessage =
                messages[convo.sid].length &&
                messages[convo.sid][messages[convo.sid].length - 1];
              if (lastMessage && lastMessage.index !== -1) {
                await convo.updateLastReadMessageIndex(lastMessage.index);
              }
            } catch {
              unexpectedErrorNotification(addNotifications);
            }
          }}
        />
      ))}
    </div>
  );
};

export default ConversationsList;
