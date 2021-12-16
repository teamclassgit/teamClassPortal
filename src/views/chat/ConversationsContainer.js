// @packages
import { useSelector } from "react-redux";

// @scripts
import ConversationsDetails from "./ConversationsDetails";
import MessagesBox from "./MessagesBox";
import MessageInputField from "./MessageInputField";
import {
  pushMessages
} from "../../redux/actions/chat";

const ConversationContainer = (props) => {
  const lastReadIndex = useSelector((state) => state.reducer.lastReadIndex.lastReadIndex);
  const loadingStatus = useSelector((state) => state.reducer.loadingStatus.loading);
  const messages = useSelector((state) => state.reducer.messages);
  const sid = useSelector((state) => state.reducer.sid.sid);
  const participants = useSelector((state) => state.reducer.participants)[sid] ?? [];
  const typingData = useSelector((state) => state.reducer.typingData)[sid] ?? [];

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff"
    }}>
      {sid && props.conversation && props.client ? (
        <>
          <ConversationsDetails
            convoSid={sid}
            convo={props.conversation}
            participants={participants}
          />

          <MessagesBox
            key={sid}
            convoSid={sid}
            convo={props.conversation}
            addMessage={pushMessages}
            client={props.client}
            messages={messages[sid] ?? []}
            loadingState={loadingStatus}
            participants={participants}
            lastReadIndex={lastReadIndex}
          />

          <MessageInputField
            convoSid={sid}
            client={props.client}
            messages={messages[sid]}
            convo={props.conversation}
            typingData={typingData}
          />
        </>
      ) : (
        <>
          <div 
            style={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              fontFamily: "Inter",
              fontSize: 30,
              fontWeight: 'normal',
              color: 'black'
            }}
          >
            Select a conversation on the left to get started.
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationContainer;
