// @packages
import Proptypes from 'prop-types';
import React, { useContext } from 'react';
import { Badge } from 'reactstrap';
import { Inbox } from 'react-feather';

// @styles
import './messageNotification.scss';
import { TwilioContext } from '../../../context/TwilioContext/TwilioContext';

const MessageNotifications = () => {
  // Twillio Chat
  const { totalUnread } = useContext(TwilioContext);

  return (
    <>
      <Inbox size={16} />
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
