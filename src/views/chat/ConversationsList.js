/* eslint-disable no-undef */
// @packages
import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";

// @scripts
import ConversationView from "./ConversationView";
import {
  informationId,
  setLastReadIndex,
  addMessages,
  updateCurrentConversation,
  updateParticipants,
  updateUnreadMessages
} from "../../redux/actions/chat";
import { getUserData } from "../../utility/Utils";

const ConversationsList = ({ client, setSelectedBooking, selectedBooking, customersData }) => {
  const selectedCustomer = useSelector((state) => state.reducer.information.info);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const typingData = useSelector((state) => state.reducer.typingData);
  const unreadMessages = useSelector((state) => state.reducer.unreadMessages.unreadMessages);
  const conversations = useSelector((state) => state.reducer.convo);
  const dispatch = useDispatch();

  const getLastMessage = (messages, typingData, convo) => {
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

  const updateCurrentConvo = async (convo, customer) => {
    dispatch(updateCurrentConversation(convo?.sid));
    dispatch(informationId(customer));

    if (!convo) return;

    try {
      dispatch(setLastReadIndex(convo.lastReadMessageIndex ?? -1));
      dispatch(updateUnreadMessages(convo.sid, 0));
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

  const renderUnreadConversations = () => {
    Object.keys(unreadMessages).map((key) => {
      if (unreadMessages[key] > 0) {
        const unreadConvo = conversations.find((convo) => convo.sid === key);
        return renderItem(
          {
            _id: "convo.sid",
            name: "nn",
            email: `${unreadConvo.sid}@conversations.com`,
            company: "nn",
            createdAt: new Date(),
            updateddAt: new Date()
          },
          unreadConvo
        );
      }
    });
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

  const renderItem = (customer, convo, index) => (
    <li
      onClick={async () => {
        await updateCurrentConvo(convo, customer);
      }}
      key={`${index}_${customer._id}`}
      style={{ backgroundColor: "transparent" }}
      className={classnames({
        active: customer._id === selectedCustomer?._id
      })}
    >
      <ConversationView
        customer={customer}
        convoId={convo?.sid}
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        currentConvoSid={sid}
        key={convo?.sid}
        setSid={updateCurrentConversation}
        messages={convo && messages[convo.sid]}
        typingInfo={(convo && typingData[convo.sid]) ?? []}
        unreadMessagesCount={(convo && setUnreadMessagesCount(sid, convo?.sid, unreadMessages, updateUnreadMessages)) || 0}
        participants={(convo && participants[convo?.sid]) ?? []}
        convo={convo}
      />
    </li>
  );

  return (
    <>
      <h4 className="chat-list-title">Chats</h4>
      <div id="conversation-list">
        <ul>
          {customersData
            .sort((a, b) => a.customer.name.localeCompare(b.customer.name))
            .map(({ customer, convo }, index) => {
              return renderItem(customer, convo, index);
            })}
        </ul>
      </div>
    </>
  );
};

ConversationsList.propTypes = {
  client: PropTypes.object.isRequired,
  customersData: PropTypes.array.isRequired,
  setSelectedBooking: PropTypes.func,
  selectedBooking: PropTypes.string
};

export default ConversationsList;
