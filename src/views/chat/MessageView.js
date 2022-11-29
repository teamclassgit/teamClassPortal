// @packages
import Avatar from "@components/avatar";
import Proptypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Check, Send, Frown, Eye } from "react-feather";
import { useSelector } from "react-redux";

// @scripts
import MessageActions from "./MessageActions";
import { MessageStatus } from "../../redux/reducers/chat/messageListReducer";

// @styles
import "./MessageView.scss";
import { getUserData } from "../../utility/Utils";

const statusStyle = {
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: "4px",
  marginTop: "4px"
};

const statusIconStyle = {
  marginLeft: "10px"
};

const MessageView = ({
  message,
  getStatus,
  userData,
  onDeleteMessage,
  author,
  statusAvatar,
  messageTime,
  topPadding,
  lastMessageBottomPadding,
  sameAuthorAsPrev
}) => {
  const [status, setStatus] = useState({});
  
  const sid = useSelector((state) => state.reducer.sid.sid);
  const participants = useSelector((state) => state.reducer.participants)[sid] ?? [];

  useEffect(() => {
    getStatus.then((value) => setStatus(value));
    return () => {
      setStatus({});
    };
  }, [getStatus, message]);

  return (
    <>
      {author === getUserData()?.customData?.email && (
        <>
          <div
            className='message-author-container'
            style={{
              paddingTop: topPadding,
              paddingBottom: lastMessageBottomPadding
            }}
          >
            <div className='message-author-sub'>
              <div className='message-view-avatar'>
                <Avatar
                  className='avatar-border'
                  content={userData && userData["name"] || "Uknown"}
                  initials
                  status={statusAvatar}
                />
              </div>
              <div className='message-author'>
                {message}
                <div className='message-time-container'>
                  <div className='message-time'>
                    {messageTime}
                  </div>
                  <div className='message-status-container'>
                    {status[MessageStatus.Delivered] ? (
                      <>
                        <Check
                          size={20}
                          color="black"
                          style={{ ...statusStyle, ...statusIconStyle }}
                        />
                        {participants.length > 2 && (
                          <span style={statusStyle}>
                            {status[MessageStatus.Delivered]}
                          </span>
                        )}
                      </>
                    ) : null}

                    {status[MessageStatus.Sending] ? (
                      <>
                        <Send
                          size={20}
                          color="black"
                          style={{ ...statusStyle, ...statusIconStyle }}
                        />
                      </>
                    ) : null}

                    {status[MessageStatus.Failed] ? (
                      <>
                        <Frown
                          size={20}
                          color="black"
                          style={{ ...statusStyle, ...statusIconStyle }}
                        />
                        {participants.length > 2 && (
                          <span style={statusStyle}>
                            {status[MessageStatus.Failed]}
                          </span>
                        )}
                      </>
                    ) : null}

                    {status[MessageStatus.Read] ? (
                      <>
                        <div 
                          style={{
                            marginLeft: "-15px",
                            left: "15px",
                            position: "relative"
                          }}
                        >
                          <Check
                            size={20}
                            color="black"
                            style={{ ...statusStyle, ...statusIconStyle }}
                          />
                        </div>
                        <Check
                          size={20}
                          color="black"
                          style={{ ...statusStyle, ...statusIconStyle }}
                        />
                        {participants.length > 2 && (
                          <span style={statusStyle}>
                            {status[MessageStatus.Read]}
                          </span>
                        )}
                      </>
                    ) : null}

                    <MessageActions
                      messageText={typeof message === "string" ? message : ""}
                      onMessageDelete={onDeleteMessage}
                    />
                  </div>
                </div>
              </div>
            </div>

            {status[MessageStatus.Failed] ? (
              <div className='message-status-failed'>
                <span >
                  An error has occurred.
                </span>
              </div>
            ) : null}
          </div>
        </>
      )}
      {author !== getUserData()?.customData?.email && (
        <div
          className='message-not-author-container'
          style={{
            paddingBottom: lastMessageBottomPadding,
            paddingTop: topPadding
          }}
        >
          <div className='message-not-author-sub'>
            {sameAuthorAsPrev && author}
          </div>
          <div className='message-not-author'>
            <div className='message-view-avatar-not-author'>
              <Avatar
                className='avatar-border'
                content={author || "Uknown"}
                initials
                status={"online"}
              />
            </div>
            <div className='message-not-author-message'>
              {message}
              <div className='message-time-not-author'>
                {messageTime}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

MessageView.propTypes = {
  author: Proptypes.string,
  messageTime: Proptypes.string,
  onDeleteMessage: Proptypes.func,
  sameAuthorAsPrev: Proptypes.bool,
  statusAvatar: Proptypes.string,
  topPadding: Proptypes.string,
  userData: Proptypes.object
};

export default MessageView;
