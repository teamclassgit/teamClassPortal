// @packages
import { AlertTriangle, Check, Send } from 'react-feather';
import { ListGroup } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import Avatar from '@components/avatar';

//  @scripts
import RenderList from './RenderList';
import { MessageStatus } from '../../redux/reducers/chat/messageListReducer';
import { NOTIFICATION_LEVEL } from './Constants';
import { getMessageStatus } from './Apis';

// @styles
import './ConversationView.scss';
import { capitalizeString } from '../../utility/Utils';
import moment from 'moment';

const calculateUnreadMessagesWidth = (count) => {
  if (count === 0 || !count) {
    return 0;
  }
  const countAsString = count.toString();
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return 0;
  }
  context.font = 'bold 14px Inter';
  const width = context.measureText(countAsString).width;
  return width + 32;
};

const truncateMiddle = (text, countWidth) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    return text;
  }
  context.font = 'bold 14px Inter';
  const width = context.measureText(text).width;
  if (width > 288 - countWidth) {
    const textLength = text.length;
    const avgLetterSize = width / textLength;
    const nrOfLetters = (288 - countWidth) / avgLetterSize;
    const delEachSide = (textLength - nrOfLetters + 1) / 2;
    const endLeft = Math.floor(textLength / 2 - delEachSide);
    const startRight = Math.ceil(textLength / 2 + delEachSide);
    return `${text.substr(0, endLeft)}...${text.substr(startRight)}`;
  }
  return text;
};

const getLastMessageTime = (messages) => {
  if (messages === undefined || messages === null || messages.length === 0) {
    return '';
  }
  const lastMessageDate = messages[messages.length - 1].dateCreated;
  const today = new Date();
  const diffInDates = Math.floor(today.getTime() - lastMessageDate.getTime());
  const dayLength = 1000 * 60 * 60 * 24;
  const weekLength = dayLength * 7;
  const yearLength = weekLength * 52;
  const diffInDays = Math.floor(diffInDates / dayLength);
  const diffInWeeks = Math.floor(diffInDates / weekLength);
  const diffInYears = Math.floor(diffInDates / yearLength);
  if (diffInDays < 0) {
    return '';
  }
  if (diffInDays === 0) {
    const minutesLessThanTen = lastMessageDate.getMinutes() < 10 ? '0' : '';
    return `${lastMessageDate.getHours().toString()}:${minutesLessThanTen}${lastMessageDate.getMinutes().toString()}`;
  }
  if (diffInDays === 1) {
    return '1 day ago';
  }
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }
  if (diffInDays < 14) {
    return '1 week ago';
  }
  if (diffInWeeks < 52) {
    return `${diffInWeeks} weeks ago`;
  }
  if (diffInYears < 2) {
    return '1 year ago';
  }
  return `${diffInYears} years ago`;
};

const ConversationView = (props) => {
  const { convo, unreadMessagesCount, customer, selectedBooking, setSelectedBooking } = props;
  const conversationDate = convo?.lastMessage?.dateCreated ? `Last message: ${moment(convo?.lastMessage?.dateCreated).fromNow()}` : 'No messsages';

  truncateMiddle(convo?.friendlyName ?? convo?.sid, calculateUnreadMessagesWidth(unreadMessagesCount));

  const textColor = unreadMessagesCount > 0 ? 'white' : 'black';
  const muted = props?.otherConvo?.notificationLevel === NOTIFICATION_LEVEL.MUTED;
  const time = getLastMessageTime(props?.messages);
  const [seeBookings, setSeeBookings] = useState(false);

  return (
    <>
      <Avatar
        size="lg"
        className="avatar-border"
        badgeUp={unreadMessagesCount > 0}
        badgeText={`${unreadMessagesCount}`}
        contentStyles={{ fontSize: '1rem', width: '44px', height: '44px' }}
        color={`light-success`}
        content={customer?.name}
        initials
      />
      <div className="pl-1 text-truncate">
        <span className="d-flex">
          <span className="render-list-span render-list card-text">
            <a title={capitalizeString(customer?.name)}>{`${capitalizeString(customer?.name.split(' ')[0])} (${capitalizeString(
              customer?.company || customer.email.split('@')[1]
            )})`}</a>
          </span>
        </span>
        <div className={'typing-info-container p-0'}>
         <small>{conversationDate}</small>
        </div>
        <div style={{ color: muted ? 'gray' : 'black' }}>
          {seeBookings && (
            <ListGroup tag="div">
              {customer &&
                customer?.bookings?.map((booking, index) => {
                  return (
                    <RenderList
                      key={`${booking._id}${index}`}
                      booking={booking}
                      setSelectedBooking={setSelectedBooking}
                      isActive={booking._id === selectedBooking}
                    />
                  );
                })}
            </ListGroup>
          )}
        </div>
      </div>
    </>
  );
};
export default ConversationView;
