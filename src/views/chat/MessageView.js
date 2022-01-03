// @packages
import { CheckSquare, Send, Frown, BookOpen } from 'react-feather';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// @scripts
import MessageActions from "./MessageActions";
import { MessageStatus } from "../../redux/reducers/chat/messageListReducer";

const statusStyle = {
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: "4px"
};

const statusIconStyle = {
  marginLeft: "10px"
};

const MessageView = ({
  message,
  getStatus,
  onDeleteMessage,
  author,
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
  }, [getStatus, message]);

  if (message === undefined) {
    return <></>;
  }

  return (
    <>
      {author === localStorage.getItem("username") && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              paddingTop: topPadding,
              paddingRight: '8%',
              paddingBottom: lastMessageBottomPadding,
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                backgroundColor: 'rgb(2, 99, 224)',
                color: 'rgb(255, 255, 255)',
                fontSize: '0.875rem',
                fontWeight: '400',
                lineHeight: '1.25rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                borderRadius: '0.5rem'
              }}
            >
              {message}
              <div
                style={{
                  display: "flex",
                  flexGrow: 10,
                  paddingTop: "0.5rem",
                  justifyContent: "space-between"
                }}
              >
                <div style={{
                  fontSize: "0.75rem"
                }}>
                  {messageTime}
                </div>
                <div
                  style={{
                    paddingLeft: "0.5rem",
                    display: "flex"
                  }}
                >
                  {status[MessageStatus.Delivered] ? (
                    <>
                      <CheckSquare
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
                        color="#fff"
                        style={{ ...statusStyle, ...statusIconStyle }}
                      />
                    </>
                  ) : null}

                  {status[MessageStatus.Failed] ? (
                    <>
                      <Frown
                        color="#fff"
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
                      <BookOpen
                        color="#fff"
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

            {status[MessageStatus.Failed] ? (
              <div style={{ textAlign: "right", paddingTop: "4px" }}>
                <span style={{ color: "#D61F1F" }}>
                  An error has occurred.
                </span>
              </div>
            ) : null}
          </div>
        </>
      )}
      {author !== localStorage.getItem("username") && (
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
            paddingBottom: lastMessageBottomPadding,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: topPadding
          }}
        >
          <div
            style={{
              color: 'rgb(96, 107, 133)',
              fontSize: '0.875rem',
              fontWeight: '400',
              lineHeight: '1.25rem'
            }}
          >
            {sameAuthorAsPrev && author}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "10px"
            }}
          >
            <div
              style={{
                backgroundColor: 'rgb(244, 244, 246)',
                color: 'rgb(18, 28, 45)',
                fontSize: '0.875rem',
                fontWeight: '400',
                lineHeight: '1.25rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
                borderRadius: '0.5rem'
              }}
            >
              {message}
              <div
                style={{
                  paddingTop: "0.5rem",
                  fontSize: "0.75rem",
                  color: 'rgb(96, 107, 133)'
                }}
              >
                {messageTime}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageView;
