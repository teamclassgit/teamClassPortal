// @packages
import ConversationContainer from './ConversationsContainer';

const ChatLog = ({
  client,
  openedConversation
}) => {
  return (
    <ConversationContainer 
      conversation={openedConversation}
      client={client}
    />
  );
};

export default ChatLog;
