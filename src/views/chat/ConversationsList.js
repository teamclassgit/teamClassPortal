// @packages
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from '@apollo/client';
import { useEffect } from "react";

// @scripts 
import ConversationView from "./ConversationsView";
import {
  informationId,
  setLastReadIndex,
  updateCurrentConversation,
  updateParticipants,
  updateUnreadMessages
} from '../../redux/actions/chat';
import queryConversationsDetail from '../../graphql/QueryConversationsDetail';

const ConversationsList = ({ 
  client,
  info,
  setInfo,
  userData,
  value
}) => {
  const conversations = useSelector((state) => state.reducer.convo.convo);
  const infoId = useSelector((state) => state.reducer.information.info);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const typingData = useSelector((state) => state.reducer.typingData.typingData);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages.unreadMessages);

  const dispatch = useDispatch();

  if (conversations === undefined || conversations === null) {
    return <div className="empty" />;
  }

  const updateCurrentConvo = async (
    updateCurrentConvo,
    convo, 
    updateParticipants, 
    convoId
  ) => {
    dispatch(updateCurrentConvo(convo?.sid));
    dispatch(informationId(convoId ?? null));
  
    if (sid !== undefined && sid !== null) {
      try {
        const participants = await convo.getParticipants();
        dispatch(updateParticipants(participants, convo?.sid));
      } catch (e) {
        return Promise.reject(e);
      }
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

  useQuery(queryConversationsDetail, {
    fetchPolicy: 'no-cache',
    variables: {
      bookingIds: conversations.map((convo) => convo?.friendlyName),
      userId: userData?._id,
      searchText: value,
      limit: 10
    },
    onCompleted: (data) => {
      setInfo(data.getConversationsDetails);
    },
    pollInterval: 2000
  });

  const newConversation = (item) => conversations.find((convo) => (item?._id === convo?.channelState?.friendlyName));

  useEffect(() => {
    if (conversations.length > 0) {
      const dataWithConversations = info?.map((item) => {
        if (newConversation(item)) {
          return {
            ...newConversation(item),
            ...item
          };
        } else {
          return item;
        }
      });
      setInfo(dataWithConversations);
    }
  }, [conversations]);

  return (
    <div id="conversation-list">
      {info?.map((convo) => {
        return (
          <ConversationView
            client={client}
            convoId={convo?.sid || convo?._id}
            currentConvoSid={sid}
            info={info}
            infoId={infoId}
            key={convo?.sid || convo?._id}
            longInfo={convo?._id}
            setSid={updateCurrentConversation}
            userData={userData}
            lastMessage={getLastMessage(
              messages[convo?.sid] ?? [],
              typingData[convo?.sid] ?? []
            )}
            messages={messages[convo.sid]}
            myMessage={isMyMessage(messages[convo.sid])}
            typingInfo={typingData[convo.sid] ?? []}
            unreadMessagesCount={setUnreadMessagesCount(
              sid,
              convo.sid,
              unreadMessages,
              updateUnreadMessages
            )}
            updateUnreadMessages={updateUnreadMessages}
            participants={participants[convo.sid] ?? []}
            convo={convo}
            otherConvo={conversations.find((item) => item?.sid === convo?.sid)}
            onClick={async () => {
              try {
                dispatch(setLastReadIndex(convo.lastReadMessageIndex ?? -1));
                await updateCurrentConvo(
                  updateCurrentConversation,
                  conversations.find((item) => item?.sid === convo?.sid),
                  updateParticipants,
                  convo?._id
                );
                dispatch(updateUnreadMessages(convo.sid, 0));
              } catch (e) {
                console.log(e);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default ConversationsList;
