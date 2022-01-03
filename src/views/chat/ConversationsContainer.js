// @packages
import { useSelector } from "react-redux";

// @scripts
import ConversationsDetails from "./ConversationsDetails";
import MessagesBox from "./MessagesBox";
import StartConversation from "./StartConversation";
import MessageInputField from "./MessageInputField";
import {
  pushMessages
} from "../../redux/actions/chat";

const ConversationContainer = ({
  conversation,
  client,
  openedNotConversations,
  openedConversationInfo
}) => {
  const lastReadIndex = useSelector((state) => state.reducer.lastReadIndex.lastReadIndex);
  const loadingStatus = useSelector((state) => state.reducer.loadingStatus.loading);
  const messages = useSelector((state) => state.reducer.messages);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const participants = useSelector((state) => state.reducer.participants)[sid] ?? [];
  const typingData = useSelector((state) => state.reducer.typingData)[sid] ?? [];

  return (
    <div style={{
      height: "100%",
      width: sid && conversation && client ? "calc(100% - 300px)" : "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff"
    }}
    >
      {sid && conversation && client ? (
        <>
          <ConversationsDetails
            convo={conversation}
            conversation={openedConversationInfo}
            participants={participants}
          />

          <MessagesBox
            key={sid}
            convoSid={sid}
            convo={conversation}
            addMessage={pushMessages}
            client={client}
            messages={messages[sid]}
            loadingState={loadingStatus}
            participants={participants}
            lastReadIndex={lastReadIndex}
          />

          <MessageInputField
            convoSid={sid}
            client={client}
            messages={messages[sid]}
            convo={conversation}
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

export default ConversationContainer;
