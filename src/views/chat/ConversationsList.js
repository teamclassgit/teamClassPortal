// @packages
import Proptypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// @scripts
import ConversationView from './ConversationsView';
import {
  informationId,
  setLastReadIndex,
  addMessages,
  updateCurrentConversation,
  updateParticipants,
  updateUnreadMessages,
  setTotalUnreadMessagesCount as setTotalUnreadMessagesCountAction
} from '../../redux/actions/chat';

const ConversationsList = ({ client, info, userData, notifications, setSelectedBooking, selectedBooking }) => {
  const [conversationUnread, setConversationUnread] = useState(null);
  const conversations = useSelector((state) => state.reducer.convo);
  const [infoByCustomers, setInfoByCustomers] = useState([]);
  const infoId = useSelector((state) => state.reducer.information.info);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const typingData = useSelector((state) => state.reducer.typingData);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages.unreadMessages);
  const dispatch = useDispatch();

  const updateCurrentConvo = async (updateCurrentConvo, convo, updateParticipants, convoId) => {
    dispatch(updateCurrentConvo(convo?.sid));
    dispatch(informationId(convoId ?? null));

    if (convo) {
      try {
        const participants = await convo.getParticipants();
        dispatch(updateParticipants(participants, convo.sid));

        const messages = await convo.getMessages();
        dispatch(addMessages(convo.sid, messages?.items || []));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };

  const setUnreadMessagesCount = (currentconvoSid, convoSid, unreadMessages, updateUnreadMessages) => {
    if (currentconvoSid === convoSid && unreadMessages[convoSid] !== 0) {
      dispatch(updateUnreadMessages(convoSid, 0));
      return 0;
    }
    if (currentconvoSid === convoSid) {
      return 0;
    }
    return unreadMessages[convoSid];
  };

  const setFilterConversationUnreadMessages = () => {
    info?.map((convo) => {
      if (unreadMessages[convo?.sid] > 0) {
        setConversationUnread(convo);
      }
    });
  };

  useEffect(() => {
    setFilterConversationUnreadMessages();
  }, [unreadMessages]);

  useEffect(() => {
    const customers =
      info?.reduce((prev, current) => {
        const customerFound = prev.find((item) => item._id === current.customer._id);
        if (!customerFound) {
          return [...prev, { ...current.customer, sid, bookings: [current] }];
        } else {
          customerFound.bookings.push(current);
          return prev;
        }
      }, []) || [];

    setInfoByCustomers(customers);
  }, [info]);

  const setTotalUnreadMessagesCount = (unreadMessages, setTotalUnreadMessagesCount) => {
    let totalUnreadMessages = 0;
    Object.keys(unreadMessages).forEach((key) => {
      totalUnreadMessages += unreadMessages[key];
    });
    dispatch(setTotalUnreadMessagesCount(totalUnreadMessages));
  };

  const isMyMessage = (messages) => {
    if (messages === undefined || messages === null || messages.length === 0) {
      return false;
    }
    return messages[messages.length - 1].author === localStorage.getItem('username') ? messages[messages.length - 1] : false;
  };

  const getLastMessage = (messages, typingData) => {
    if (messages === undefined || messages === null) {
      return 'Loading...';
    }
    if (typingData.length) {
      return getTypingMessage(typingData);
    }
    if (messages.length === 0) {
      return 'No messages';
    }
    if (!!messages[messages.length - 1].media) {
      return 'Media message';
    }
    return messages[messages.length - 1].body;
  };

  if (messages === undefined || messages === null) {
    return <div className="empty" />;
  }

  return (
    <>
      {!notifications && (
        <div id="conversation-list">
          <ul>
            {infoByCustomers?.map((customer) => {
              const convo = customer?.bookings?.length > 0 ? customer.bookings[0] : undefined;
              return (
                <ConversationView
                  client={client}
                  customer={customer}
                  convoId={convo?.sid || convo?._id}
                  selectedBooking={selectedBooking}
                  setSelectedBooking={setSelectedBooking}
                  convoClass={convo?.classTitle}
                  currentConvoSid={sid}
                  info={info}
                  conversationUnread={conversationUnread}
                  infoId={infoId}
                  key={convo?._id}
                  longInfo={convo?._id}
                  setSid={updateCurrentConversation}
                  userData={userData}
                  lastMessage={getLastMessage(messages[convo?.sid] ?? [], typingData[convo?.sid] ?? [])}
                  messages={messages[convo.sid]}
                  myMessage={isMyMessage(messages[convo.sid])}
                  typingInfo={typingData[convo.sid] ?? []}
                  unreadMessagesCount={setUnreadMessagesCount(sid, convo?.sid, unreadMessages, updateUnreadMessages)}
                  updateUnreadMessages={updateUnreadMessages}
                  updateTotalUnreadCount={setTotalUnreadMessagesCount(unreadMessages, setTotalUnreadMessagesCountAction)}
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
                        convo._id
                      );
                      if (convo?.sid) {
                        dispatch(updateUnreadMessages(convo.sid, 0));
                      }
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                />
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

ConversationsList.defaultProps = {
  notifications: false
};

ConversationsList.propTypes = {
  client: Proptypes.object,
  info: Proptypes.array,
  userData: Proptypes.object,
  notifications: Proptypes.bool
};

export default ConversationsList;
