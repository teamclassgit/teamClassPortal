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
  setTotalUnreadMessagesCount
} from '../../redux/actions/chat';
import { getUserData } from '../../utility/Utils';

const ConversationsList = ({ setSelectedBooking, selectedBooking }) => {
  //const [conversationUnread, setConversationUnread] = useState(null);
  const conversations = useSelector((state) => state.reducer.convo);
  //const [infoByCustomers, setInfoByCustomers] = useState([]);
  const infoId = useSelector((state) => state.reducer.information.info);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const typingData = useSelector((state) => state.reducer.typingData);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages.unreadMessages);
  const dispatch = useDispatch();

  /*const setFilterConversationUnreadMessages = () => {
    info?.map((convo) => {
      if (unreadMessages[convo?.sid] > 0) {
        setConversationUnread(convo);
      }
    });
  };

  useEffect(() => {
    setFilterConversationUnreadMessages();
  }, [unreadMessages]);*/

  /*useEffect(() => {
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
  }, [info]);*/

  /*const setTotalUnreadMessagesCount = (unreadMessages, setTotalUnreadMessagesCount) => {
    let totalUnreadMessages = 0;
    Object.keys(unreadMessages).forEach((key) => {
      totalUnreadMessages += unreadMessages[key];
    });
    dispatch(setTotalUnreadMessagesCount(totalUnreadMessages));
  };*/

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

  const updateCurrentConvo = async (updateCurrentConvo, convo, updateParticipants, convoId) => {
    dispatch(updateCurrentConvo(convo?.sid));
    dispatch(informationId(convoId ?? null));
    if (!convo) return;

    try {
      const participants = await convo.getParticipants();
      dispatch(updateParticipants(participants, convo.sid));

      const messages = await convo.getMessages();
      dispatch(addMessages(convo.sid, messages?.items || []));
    } catch (e) {
      return Promise.reject(e);
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

  const isMyMessage = (messages) => {
    if (messages === undefined || messages === null || messages.length === 0) {
      return false;
    }
    return messages[messages.length - 1].author === getUserData()?.customData?.email ? messages[messages.length - 1] : false;
  };

  if (messages === undefined || messages === null) {
    return <div className="empty" />;
  }

  return (
    <div id="conversation-list">
      <ul>
        {conversations?.map((convo) => {
          //const convo = customer?.bookings?.length > 0 ? customer.bookings[0] : undefined;
          const customer = {
            name: 'Customer name',
            email: 'Customer email',
            company: 'Customer company',
            phone: 'Customer phone'
          };

          return (
            <li
              onClick={async () => {
                try {
                  dispatch(setLastReadIndex(convo.lastReadMessageIndex ?? -1));
                  await updateCurrentConvo(
                    updateCurrentConversation,
                    convo,
                    updateParticipants
                    //convo._id
                  );
                  dispatch(updateUnreadMessages(convo.sid, 0));
                } catch (e) {
                  console.log(e);
                }
              }}
              key={convo.sid}
              style={{ backgroundColor: 'transparent' }}
              className="conversation-view-container"
            >
              <ConversationView
                customer={customer}
                convoId={convo.sid}
                selectedBooking={selectedBooking}
                setSelectedBooking={setSelectedBooking}
                currentConvoSid={sid}
                infoId={infoId}
                key={convo.sid}
                setSid={updateCurrentConversation}
                lastMessage={getLastMessage(messages[convo?.sid] ?? [], typingData[convo?.sid] ?? [])}
                messages={messages[convo.sid]}
                myMessage={isMyMessage(messages[convo.sid])}
                typingInfo={typingData[convo.sid] ?? []}
                unreadMessagesCount={setUnreadMessagesCount(sid, convo?.sid, unreadMessages, updateUnreadMessages)}
                updateUnreadMessages={updateUnreadMessages}
                //updateTotalUnreadCount={setTotalUnreadMessagesCount(unreadMessages, setTotalUnreadMessagesCountAction)}
                participants={participants[convo.sid] ?? []}
                convo={convo}
                //otherConvo={conversations.find((item) => item?.sid === convo?.sid)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

ConversationsList.propTypes = {
  setSelectedBooking: Proptypes.func,
  selectedBooking: Proptypes.string
};

export default ConversationsList;
