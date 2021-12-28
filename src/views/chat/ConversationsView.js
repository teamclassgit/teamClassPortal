// @packages
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AlertTriangle, BellOff, BookOpen, Check, Send } from "react-feather";
import { Button } from "reactstrap";

//  @scripts
import { MessageStatus } from '../../redux/reducers/chat/messageListReducer';
import { getMessageStatus, addConversation } from './Apis';
import { NOTIFICATION_LEVEL } from "./Constants";
import RenderList from "./RenderList";
import ConversationTitleBookingModal from './ConversationTitleBookingModal';
import {
  updateCurrentConversation,
  addNotifications,
  updateParticipants,
  informationId
} from '../../redux/actions/chat';

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
  const { convo, convoId, myMessage, lastMessage, unreadMessagesCount, client } = props;
  const [backgroundColor, setBackgroundColor] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();

  const handleOpen = () => setIsModalOpen(true);

  const title = truncateMiddle(
    convo?.friendlyName ?? convo?.sid,
    calculateUnreadMessagesWidth(unreadMessagesCount)
  );

  const textColor =
    unreadMessagesCount > 0
      ? "white"
      : "black";
  const muted = convo?.notificationLevel === NOTIFICATION_LEVEL.MUTED;

  const [lastMsgStatus, setLastMsgStatus] = useState("");

  const time = getLastMessageTime(props?.messages);

  useEffect(() => {
    if ((props?.infoId === convo?._id)) {
      setBackgroundColor('#f5f5f5');
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
  }, [convo, myMessage, lastMessage, props.participants, props.typingInfo]);

  return (
    <div
      style={{
        backgroundColor,
        cursor: "pointer",
        paddingBottom: 14,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        width: 360
      }}
      id={convoId}
      className="name"
      onClick={props.onClick}
    >
      <div>
        <div display="flex">
          <div
            style={{
              width: 300,
              fontFamily: "Inter",
              fontSize: 14,
              color: muted
                ? "gray"
                : "black"
            }}
          >
            {muted ? <BellOff size={20} /> : null}
            <RenderList
              convo={convo}
              muted={muted}
              title={title}
            />
          </div>
          {unreadMessagesCount > 0 && (
            <div style={{
              paddingLeft: 8
            }}>
              <div
                style={{ 
                  borderRadius: 12, 
                  opacity: muted ? 0.2 : 1,
                  backgroundColor: 'black',
                  color: 'black',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  fontSize: 12,
                  lineHeight: '12px',
                  paddingLeft: 4,
                  paddingRight: 4
                }}
              >
                {unreadMessagesCount}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            paddingTop: 4,
            color: textColor,
            fontWeight: "300",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {!props?.typingInfo?.length ? (
              <div>
                {lastMsgStatus === MessageStatus.Sending && props.myMessage && (
                  <div style={{ paddingRight: 6 }}>
                    <Send size={20}/>
                  </div>
                )}
                {lastMsgStatus === MessageStatus.Delivered && props.myMessage && (
                  <div style={{ paddingRight: 6 }}>
                    <Check size={20} />
                  </div>
                )}
                {lastMsgStatus === MessageStatus.Failed && props.myMessage && (
                  <div style={{ paddingRight: 6 }}>
                    <AlertTriangle size={20}/>
                  </div>
                )}
                {lastMsgStatus === MessageStatus.Read && props.myMessage && (
                  <div style={{ paddingRight: 6 }}>
                    <BookOpen size={20}/>
                  </div>
                )}
              </div>
            ) : null}
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {lastMessage}
            </div>
          </div>
          <div style={{ whiteSpace: "nowrap", paddingLeft: 4 }}>{time}</div>
        </div>
      </div>
    </div>
  );
};
export default ConversationView;
