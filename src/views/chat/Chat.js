// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { sendMsg } from '../../redux/actions/chat';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Menu, Send } from 'react-feather';
import {
  Button,
  Form,
  Input,
  InputGroup
} from 'reactstrap';

const ChatLog = ({
  handleUser,
  handleUserSidebarRight,
  handleSidebar,
  store,
  userSidebarLeft
}) => {
  const { userProfile, selectedUser } = store;
  const chatArea = useRef(null);
  const dispatch = useDispatch();
  const [msg, setMsg] = useState('');

  const scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(chatArea.current);
    chatContainer.scrollTop = Number.MAX_SAFE_INTEGER;
  };

  useEffect(() => {
    const selectedUserLen = Object.keys(selectedUser).length;

    if (selectedUserLen) {
      scrollToBottom();
    }
  }, [selectedUser]);

  const formattedChatData = () => {
    let chatLog = [];
    if (selectedUser.chat) {
      chatLog = selectedUser.chat.chat;
    }

    const formattedChatLog = [];
    let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined;
    let msgGroup = {
      senderId: chatMessageSenderId,
      messages: []
    };
    chatLog.forEach((msg, index) => {
      if (chatMessageSenderId === msg.senderId) {
        msgGroup.messages.push({
          msg: msg.message,
          time: msg.time
        });
      } else {
        chatMessageSenderId = msg.senderId;
        formattedChatLog.push(msgGroup);
        msgGroup = {
          senderId: msg.senderId,
          messages: [
            {
              msg: msg.message,
              time: msg.time
            }
          ]
        };
      }
      if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
    });
    return formattedChatLog;
  };

  const renderChats = () => {
    return formattedChatData().map((item, index) => {
      return (
        <div
          key={index}
          className={classnames('chat', {
            'chat-left': item.senderId !== 11
          })}
        >
          <div className='chat-avatar'>
            <Avatar
              className='box-shadow-1 cursor-pointer'
              img={item.senderId === 11 ? userProfile.avatar : selectedUser.contact.avatar}
            />
          </div>

          <div className='chat-body'>
            {item.messages.map(chat => (
              <div key={chat.msg} className='chat-content'>
                <p>{chat.msg}</p>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const handleAvatarClick = obj => {
    handleUserSidebarRight();
    handleUser(obj);
  };

  const handleStartConversation = () => {
    if (!Object.keys(selectedUser).length && !userSidebarLeft && window.innerWidth <= 1200) {
      handleSidebar();
    }
  };

  const handleSendMsg = e => {
    e.preventDefault();
    if (msg.length) {
      dispatch(sendMsg({ ...selectedUser, message: msg }));
      setMsg('');
    }
  };

  const ChatWrapper = Object.keys(selectedUser).length && selectedUser.chat ? PerfectScrollbar : 'div';

  return (
    <div className='chat-app-window'>
      <div className={classnames('start-chat-area', { 'd-none': Object.keys(selectedUser).length })}>
        <div className='start-chat-icon mb-1'>
          <MessageSquare />
        </div>
        <h4 className='sidebar-toggle start-chat-text' onClick={handleStartConversation}>
          Start Conversation
        </h4>
      </div>
      {Object.keys(selectedUser).length && (
        <div className={classnames('active-chat', { 'd-none': selectedUser === null })}>
          <div className='chat-navbar'>
            <header className='chat-header'>
              <div className='d-flex align-items-center'>
                <div className='sidebar-toggle d-block d-lg-none mr-1' onClick={handleSidebar}>
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight='36'
                  imgWidth='36'
                  img={selectedUser.contact.avatar}
                  status={selectedUser.contact.status}
                  className='avatar-border user-profile-toggle m-0 mr-1'
                  onClick={() => handleAvatarClick(selectedUser.contact)}
                />
                <h6 className='mb-0'>{selectedUser.contact.fullName}</h6>
              </div>
            </header>
          </div>

          <ChatWrapper ref={chatArea} className='user-chats' options={{ wheelPropagation: false }}>
            {selectedUser.chat ? <div className='chats'>{renderChats()}</div> : null}
          </ChatWrapper>

          <Form className='chat-app-form' onSubmit={e => handleSendMsg(e)}>
            <InputGroup className='input-group-merge mr-1 form-send-message'>
              <Input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder='Type your message'
              />
            </InputGroup>
            <Button className='send' color='primary'>
              <Send size={14} className='d-lg-none' />
              <span className='d-none d-lg-block'>Send</span>
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ChatLog;
