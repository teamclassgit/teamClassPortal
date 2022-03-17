// @packages
import { useEffect, useMemo } from 'react';
import Avatar from '@components/avatar';
import Proptypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import { X, Search } from 'react-feather';
import { debounce } from 'lodash';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Spinner } from 'reactstrap';

// @scripts
import ConversationsList from './ConversationsList';
import SidebarInfo from './SidebarInfo';

// @styles
import './SidebarLeft.scss';

const SidebarLeft = ({
  client,
  handleSidebar,
  handleUserSidebarLeft,
  infoDetails,
  setInputValue,
  setStatus,
  sidebar,
  status,
  isInfoReady,
  userData,
  userSidebarLeft,
  setSelectedBooking,
  selectedBooking
}) => {
  const changeHandler = (event) => {
    setInputValue(event.target.value);
    setSelectedBooking(null);
  };
  const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 1000), []);

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, []);

  return (
    <div className="sidebar-left">
      <div className="sidebar">
        <div
          className={classnames('chat-profile-sidebar', {
            show: userSidebarLeft
          })}
        >
          <SidebarInfo handleUserSidebarLeft={handleUserSidebarLeft} setStatus={setStatus} status={status} userData={userData} />
        </div>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === true
          })}
        >
          <div className="sidebar-close-icon" onClick={handleSidebar}>
            <X size={14} />
          </div>
          <div className="chat-fixed-title">
            <h4 className="conversations">Conversations</h4>
          </div>
          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div className="sidebar-profile-toggle" onClick={handleUserSidebarLeft}>
                <Avatar className="avatar-border" content={(userData && userData['name']) || 'Unknown'} initials status={status} />
              </div>
              <InputGroup className="input-group-merge ml-1 w-100">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="round">
                    <Search className="text-muted" size={14} />
                  </InputGroupText>
                </InputGroupAddon>
                <Input className="round" onChange={debouncedChangeHandler} placeholder="Search a booking conversation" type="text" />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className="chat-user-list-wrapper list-group"
            options={{ wheelPropagation: false }}
            style={{ height: 'calc(100% - 110px)' }}
          >
            <h4 className="chat-list-title">Chats</h4>
            {isInfoReady ? (
              <ConversationsList
                client={client}
                info={infoDetails}
                userData={userData}
                selectedBooking={selectedBooking}
                setSelectedBooking={setSelectedBooking}
              />
            ) : (<Spinner className="spinner" color="primary" />)}
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

SidebarLeft.propTypes = {
  client: Proptypes.object,
  handleSidebar: Proptypes.func,
  handleUserSidebarLeft: Proptypes.func,
  infoDetails: Proptypes.array,
  inputValue: Proptypes.string,
  setInputValue: Proptypes.func,
  setStatus: Proptypes.func,
  sidebar: Proptypes.bool,
  status: Proptypes.string,
  userData: Proptypes.object,
  userSidebarLeft: Proptypes.bool
};

export default SidebarLeft;
