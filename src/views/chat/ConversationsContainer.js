// @packages
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

// @scripts
import ConversationsDetails from "./ConversationsDetails";
import MessageInputField from "./MessageInputField";
import MessagesBox from "./MessagesBox";
import StartConversation from "./StartConversation";
import { pushMessages } from "../../redux/actions/chat";

// @scripts
import './ConversationsContainer.scss';

const ConversationContainer = ({
  client,
  conversation,
  openedConversationInfo,
  openedNotConversations,
  status,
  id,
  userData
}) => {
  const sid = useSelector((state) => state.reducer.sid.sid);
  const lastReadIndex = useSelector((state) => state.reducer.lastReadIndex.lastReadIndex);
  const loadingStatus = useSelector((state) => state.reducer.loadingStatus.loading);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants)[sid] ?? [];
  const typingData = useSelector((state) => state.reducer.typingData)[sid] ?? [];

  return (
    <div 
      className={
        id ? "chatContainer-with-conversations" 
          : "chatContainer-without-conversations"
      }
    >
      {sid && conversation ? (
        <>
          <ConversationsDetails
            conversation={openedConversationInfo}
            convo={conversation}
            participants={participants}
          />

          <MessagesBox
            addMessage={pushMessages}
            client={client}
            convo={conversation}
            convoSid={sid}
            key={sid}
            lastReadIndex={lastReadIndex}
            loadingState={loadingStatus}
            messages={messages[sid]}
            participants={participants}
            status={status}
            userData={userData}
          />

          <MessageInputField
            client={client}
            convo={conversation}
            convoSid={sid}
            messages={messages[sid]}
            typingData={typingData}
          />
        </>
      ) : (
        <StartConversation 
          client={client}
          info={openedNotConversations}
        />
      )}
    </div>
  );
};

ConversationContainer.propTypes = {
  client: PropTypes.object.isRequired,
  conversation: PropTypes.object,
  openedConversationInfo: PropTypes.object,
  openedNotConversations: PropTypes.object,
  status: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired
};

export default ConversationContainer;
