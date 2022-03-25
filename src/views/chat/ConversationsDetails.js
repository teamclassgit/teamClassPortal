// @packages
import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from 'reactstrap';

// @scripts
import Settings from './Settings';

// @styles
import './ConversationsDetails.scss';

const ConversationDetails = ({ conversation, convo, participants }) => (
  <div className="conversations-details-container">
    <div className="conversations-details">
      <div className="conversations-instructor">{conversation?.customer?.name}</div>
      <div className="conversations-participants-container">
        <div className="conversations-participants">
          {participants?.length}
          {participants?.length > 1 ? ' participants' : ' participant'}
        </div>
        <Settings convo={convo} participants={participants} />
      </div>
    </div>
    <div className="conversations-badge">
      <Badge className="booking-checkout-summary-priceBadge">Coordinator / Customer</Badge>
    </div>
  </div>
);

ConversationDetails.propTypes = {
  convo: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired
};

export default ConversationDetails;
