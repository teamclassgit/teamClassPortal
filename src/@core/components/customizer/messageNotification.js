// @packages
import ConversationsList from '@src/views/chat/ConversationsList';
import Proptypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';
import { MessageSquare } from 'react-feather';

// @scripts
import useTwilioClient from '../../hooks/useTwilioClient';

// @styles
import './messageNotification.scss';

const MessageNotifications = ({ totalUnread }) => {

  const { client, infoDetails, userData } = useTwilioClient();

  return ( 
    <>
      <MessageSquare size={16} />
      {totalUnread > 0 && (
        <Badge 
          pill 
          color='danger' 
          className='badge-notifications'
        >
          {totalUnread}
        </Badge>
      )}
      <ConversationsList 
        client={client}
        info={infoDetails}
        userData={userData}
        notifications={true}
      />
    </>
  );
};

MessageNotifications.propTypes = {
  totalUnread: Proptypes.number
};
 
export default MessageNotifications;