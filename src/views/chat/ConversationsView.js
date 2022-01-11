// @packages
import { AlertTriangle, Check, Send } from "react-feather";
import { Badge } from "reactstrap";
import React, { useEffect, useState } from "react";

//  @scripts
import RenderList from "./RenderList";
import { MessageStatus } from '../../redux/reducers/chat/messageListReducer';
import { NOTIFICATION_LEVEL } from "./Constants";
import { getMessageStatus } from './Apis';

// @styles
import './ConversationView.scss';

const calculateUnreadMessagesWidth = (count) => {
  if (count === 0 || !count) {
    return 0;
  }
  const countAsString = count.toString();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return 0;
  }
  context.font = "bold 14px Inter";
  const width = context.measureText(countAsString).width;
  return width + 32;
};

const truncateMiddle = (text, countWidth) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return text;
  }
  context.font = "bold 14px Inter";
  const width = context.measureText(text).width;
  if (width > 288 - countWidth) {
    const textLength = text.length;
    const avgLetterSize = width / textLength;
    const nrOfLetters = (288 - countWidth) / avgLetterSize;
    const delEachSide = (textLength - nrOfLetters + 1) / 2;
    const endLeft = Math.floor(textLength / 2 - delEachSide);
    const startRight = Math.ceil(textLength / 2 + delEachSide);
    return `${text.substr(0, endLeft)  }...${  text.substr(startRight)}`;
  }
  return text;
};

const getLastMessageTime = (messages) => {
  if (messages === undefined || messages === null || messages.length === 0) {
    return "";
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
    return "";
  }
  if (diffInDays === 0) {
    const minutesLessThanTen = lastMessageDate.getMinutes() < 10 ? "0" : "";
    return (
      `${lastMessageDate.getHours().toString() 
      }:${ 
        minutesLessThanTen 
      }${lastMessageDate.getMinutes().toString()}`
    );
  }
  if (diffInDays === 1) {
    return "1 day ago";
  }
  if (diffInDays < 7) {
    return `${diffInDays  } days ago`;
  }
  if (diffInDays < 14) {
    return "1 week ago";
  }
  if (diffInWeeks < 52) {
    return `${diffInWeeks  } weeks ago`;
  }
  if (diffInYears < 2) {
    return "1 year ago";
  }
  return `${diffInYears  } years ago`;
};

const ConversationView = (
  props
) => {
  const { convo, convoId, myMessage, lastMessage, unreadMessagesCount, notifications } = props;
  const [backgroundColor, setBackgroundColor] = useState();
  const [lastMsgStatus, setLastMsgStatus] = useState("");

  truncateMiddle(
    convo?.friendlyName ?? convo?.sid,
    calculateUnreadMessagesWidth(unreadMessagesCount)
  );

  const textColor =
    unreadMessagesCount > 0
      ? "white"
      : "black";
  const muted = props?.otherConvo?.notificationLevel === NOTIFICATION_LEVEL.MUTED;
  const time = getLastMessageTime(props?.messages);

  useEffect(() => {
    if ((props?.infoId === convo?._id)) {
      setBackgroundColor("aliceblue");
      return;
    }
    setBackgroundColor('transparent');
  }, [props]);

  useEffect(() => {
    if (myMessage && !props?.typingInfo?.length) {
      getMessageStatus(convo, myMessage, props.participants).then(
        (statuses) => {
          if (statuses[MessageStatus.Read]) {
            setLastMsgStatus(MessageStatus.Read);
            return;
          }
          if (statuses[MessageStatus.Delivered]) {
            setLastMsgStatus(MessageStatus.Delivered);
            return;
          }
          if (statuses[MessageStatus.Failed]) {
            setLastMsgStatus(MessageStatus.Failed);
            return;
          }
          if (statuses[MessageStatus.Sending]) {
            setLastMsgStatus(MessageStatus.Sending);
            
          }
        }
      );
    }
    return () => {
      setLastMsgStatus("");
    };
  }, [convo, myMessage, lastMessage, props.participants, props.typingInfo]);

  return (
    <>
      {!notifications && (
        <div
          className="conversation-view-container"
          onClick={props.onClick}
          style={{ backgroundColor }}
        >
          <div
            className="conversation-view-sub-container"
            style={{ color: muted ? "gray" : "black" }}
          >
            <RenderList convo={convo} convoId={convoId ?? ''} />
            {unreadMessagesCount > 0 && (
              <div className="unread-message-count">
                <Badge pill color='danger'>
                  {unreadMessagesCount}
                </Badge>
              </div>
            )}
          </div>
          <div
            className={!unreadMessagesCount ? "typing-info-container" : "typing-info-container-hidden"}
            style={{ color: textColor }}
          >
            <div className="typing-info">
              {!props?.typingInfo?.length && (
                <div>
                  {lastMsgStatus === MessageStatus.Sending && props.myMessage && (
                    <div className="message-status">
                      <Send size={20}/>
                    </div>
                  )}
                  {lastMsgStatus === MessageStatus.Delivered && props.myMessage && (
                    <div className="message-status">
                      <Check size={20} />
                    </div>
                  )}
                  {lastMsgStatus === MessageStatus.Failed && props.myMessage && (
                    <div className="message-status">
                      <AlertTriangle size={20}/>
                    </div>
                  )}
                  {lastMsgStatus === MessageStatus.Read && props.myMessage && (
                    <div className="message-status">
                      <div 
                        style={{
                          marginLeft: "-5px",
                          left: '5px',
                          top: '-1px',
                          position: "relative"
                        }}
                      >
                        <Check
                          size={20}
                          color="black"
                        />
                      </div>
                      <Check
                        size={20}
                        color="black"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="last-message">
                {lastMessage}
              </div>
            </div>
            <div className="time">{time}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default ConversationView;
