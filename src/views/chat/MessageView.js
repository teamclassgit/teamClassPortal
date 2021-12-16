import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MessageStatus } from "../../redux/reducers/chat/messageListReducer";
import MessageActions from "./MessageActions";
import { CheckSquare, Send, Frown, BookOpen } from 'react-feather';

const statusStyle = {
  display: "inline-block",
  verticalAlign: "middle",
  marginLeft: "4px"
};

const statusIconStyle = {
  marginLeft: "10px"
};

const MessageView = (
  props
) => {
  const { message, getStatus, onDeleteMessage } = props;

  console.log(props);

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
      {props.author === localStorage.getItem("username") && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              paddingTop: props.topPadding,
              paddingBottom: props.lastMessageBottomPadding
            }}
          >
            <div
              style={{
                backgroundColor: 'rgb(2, 99, 224)',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: '1.2',
                paddingTop: '5px',
                marginBottom: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '5px'
              }}
            >
              {props.message}
              <div
                style={{
                  display: "flex",
                  flexGrow: 10,
                  paddingTop: "5px",
                  justifyContent: "space-between"
                }}
              >
                <div style={{
                  fontSize: "12px"
                }}>
                  {props.messageTime}
                </div>
                <div
                  style={{
                    paddingLeft: "10px",
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
      {props.author !== localStorage.getItem("username") && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingTop: props.topPadding,
            paddingBottom: props.lastMessageBottomPadding
          }}
        >
          <div
            style={{
              color: 'blue',
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              lineHeight: '1.5'
            }}
          >
            {props.sameAuthorAsPrev && props.author}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row"
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                color: 'blue',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 'bold',
                lineHeight: '1.5',
                paddingTop: '5px',
                paddingBottom: '5px',
                paddingLeft: '10px',
                paddingRight: '10px',
                borderRadius: '5px'
              }}
            >
              {props.message}
              <div
                style={{
                  paddingTop: "5px",
                  fontSize: "12px",
                  color: 'blue'
                }}
              >
                {props.messageTime}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageView;
