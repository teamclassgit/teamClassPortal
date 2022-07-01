// @packages
import Proptypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';
import { MessageSquare } from 'react-feather';
import { useSelector } from 'react-redux';
// @scripts
import useTwilioClient from '../../hooks/useTwilioClient';

// @styles
import './messageNotification.scss';

const MessageNotifications = () => {
  // Twillio Chat
  useTwilioClient();
  const totalUnread = useSelector((state) => state.reducer.totalUnreadCount);

  return (
    <>
      <MessageSquare size={16} />
      {totalUnread > 0 && (
        <Badge pill color="danger" className="badge-notifications">
          {totalUnread}
        </Badge>
      )}
    </>
  );
};

MessageNotifications.propTypes = {
  totalUnread: Proptypes.number
};

export default MessageNotifications;
