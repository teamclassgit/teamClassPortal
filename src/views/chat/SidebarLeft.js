// @packages
import Avatar from '@components/avatar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X, Search } from 'react-feather';
import { useEffect, useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from 'reactstrap';

// @scripts
import ConversationsList from './ConversationsList';
import SidebarInfo from './SidebarInfo';

const SidebarLeft = ({
  client,
  handleSidebar,
  handleUserSidebarLeft,
  infoDetails,
  inputValue,
  setInfoDetails,
  setInputValue,
  sidebar,
  userData,
  userSidebarLeft
}) => {
  const [status, setStatus] = useState('online');

  useEffect(() => {
    setStatus(userData?.status);
  }, [userData]);

  return (
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
          <SidebarInfo 
            handleUserSidebarLeft={handleUserSidebarLeft}
            setStatus={setStatus}
            status={status}
            userData={userData}
          />
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className='sidebar-close-icon' onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className='chat-fixed-title'>
            <h4>Conversations</h4>
          </div>
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <div className='sidebar-profile-toggle' onClick={handleUserSidebarLeft}>
                <Avatar
                  className='avatar-border'
                  content={(userData && userData['name']) || 'Uknown'} 
                  initials
                  status={status}
                />
              </div>
              <InputGroup className='input-group-merge ml-1 w-100'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText className='round'>
                    <Search className='text-muted' size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  className='round'
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='Search a booking conversation'
                  type='text'
                  value={inputValue}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar 
            className='chat-user-list-wrapper list-group' 
            options={{ wheelPropagation: false }}
            style={{
              height: 'calc(100vh - 210px)'
            }}
          >
            <h4 className='chat-list-title'>Chats</h4>
            {client?.connectionState !== "denied" && (
              <ConversationsList
                client={client}
                info={infoDetails}
                setInfo={setInfoDetails}
                userData={userData}
                value={inputValue}
              />
            )}
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
