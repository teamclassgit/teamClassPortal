// @packages
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

// @scripts
import ConversationsDetails from "./ConversationsDetails";
import MessageInputField from "./MessageInputField";
import MessagesBox from "./MessagesBox";
import StartConversation from "./StartConversation";
import { pushMessages } from "@redux/actions/chat";

// @scripts
import "./ConversationsContainer.scss";
import { getUserData } from "@utility/Utils";

const ConversationContainer = ({ client, conversation, status, customer }) => {
  const userData = getUserData();
  const sid = conversation?.sid;
  const lastReadIndex = useSelector((state) => state.reducer.lastReadIndex.lastReadIndex);
  const loadingStatus = useSelector((state) => state.reducer.loadingStatus.loading);
  const messages = useSelector((state) => state.reducer.messages);
  const participants = useSelector((state) => state.reducer.participants)[sid] ?? [];
  const typingData = useSelector((state) => state.reducer.typingData)[sid] ?? [];

  return (
    <div className={"chatContainer-without-conversations"}>
      {conversation ? (
        <>
          <ConversationsDetails convo={conversation} participants={participants} customer={customer} />

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

          <MessageInputField client={client} convo={conversation} convoSid={sid} messages={messages[sid]} typingData={typingData} />
        </>
      ) : (
        <StartConversation client={client} customer={customer} />
      )}
    </div>
  );
};

ConversationContainer.propTypes = {
  client: PropTypes.object.isRequired,
  conversation: PropTypes.object,
  customerId: PropTypes.string,
  status: PropTypes.string
};

export default ConversationContainer;
