// @packages
import React from 'react';
import { Bell } from 'react-feather';
import {
  Badge,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap';
import { useHistory } from 'react-router';

// @scripts
import useTwilioClient from '../../../hooks/useTwilioClient';
import ConversationsList from '@src/views/chat/ConversationsList';

const NotificationDropdown = ({
  filterData,
  totalUnread
}) => {
  const history = useHistory();
  const { client, infoDetails, userData } = useTwilioClient();

  const handleChatClick = () => { 
    history.push('/chat');
  };

  return (
    <UncontrolledDropdown tag='li' className='dropdown-notification nav-item mr-25'>
      <DropdownToggle tag='a' className='nav-link' href='/' onClick={e => e.preventDefault()}>
        <Bell size={21} />
        {totalUnread > 0 && (
          <Badge pill color='danger' className='badge-up'>
            {totalUnread}
          </Badge>
        )}
      </DropdownToggle>
      <DropdownMenu tag='ul' right className='dropdown-menu-media mt-0'>
        <li className='dropdown-menu-header'>
          <DropdownItem className='d-flex' tag='div' header>
            <h4 className='notification-title mb-0 mr-auto'>Notifications</h4>
            {filterData?.length > 0 && (
              <Badge tag='div' color='light-primary' pill>
                {`${filterData?.length} New`}
              </Badge>
            )}
          </DropdownItem>
          <DropdownItem >
            <ConversationsList 
              client={client}
              info={infoDetails}
              userData={userData}
              notifications={true}
            />
          </DropdownItem>
        </li>
        <li className='dropdown-menu-footer'>
          <Button.Ripple color='primary' block onClick={handleChatClick}>
            Read all notifications
          </Button.Ripple>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default NotificationDropdown;
