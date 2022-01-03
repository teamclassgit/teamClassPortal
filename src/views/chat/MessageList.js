// @packages
import React, { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@twilio-paste/theme";

// @scripts
import Horizon from "./Horizon";
import MessageFile from "./MessageFile";
import MessageView from "./MessageView";
import { getBlobFile, getMessageStatus } from './Apis';
import {
  addAttachment
} from '../../redux/actions/chat/index';

function getMessageTime (message) {
  const dateCreated = message.dateCreated;
  const today = new Date();
  const diffInDates = Math.floor(today.getTime() - dateCreated.getTime());
  const dayLength = 1000 * 60 * 60 * 24;
  const diffInDays = Math.floor(diffInDates / dayLength);
  const minutesLessThanTen = dateCreated.getMinutes() < 10 ? "0" : "";

  if (diffInDays === 0) {
    return (
      `${dateCreated.getHours().toString() 
      }:${ 
        minutesLessThanTen 
      }${dateCreated.getMinutes().toString()}`
    );
  }

  return (
    `${dateCreated.getDate() 
    }/${ 
      dateCreated.getMonth() 
    }/${ 
      dateCreated.getFullYear().toString().substr(-2) 
    } ${ 
      dateCreated.getHours().toString() 
    }:${ 
      minutesLessThanTen 
    }${dateCreated.getMinutes().toString()}`
  );
}

const MessageList = (props) => {
  const { messages, conversation, lastReadIndex } = props;
  if (messages === undefined) {
    return <div className="empty" />;
  }

  const myRef = useRef(null);
  const messagesLength = messages.length;

  const dispatch = useDispatch();
  
  const conversationAttachments = useSelector(
    (state) => state.reducer.attachments[conversation.sid]
  );

  const [imagePreview, setImagePreview] = useState({
    message : null,
    file : null
  });
  const [fileLoading, setFileLoading] = useState({});

  const [horizonAmount, setHorizonAmount] = useState(0);
  const [showHorizonIndex, setShowHorizonIndex] = useState(0);
  const [scrolledToHorizon, setScrollToHorizon] = useState(false);

  useEffect(() => {
    if (scrolledToHorizon || !myRef.current) {
      return;
    }
    myRef.current.scrollIntoView({
      behavior: "smooth"
    });
    setScrollToHorizon(true);
  });

  useEffect(() => {
    if (lastReadIndex === -1 || horizonAmount) {
      return;
    }
    let showIndex = 0;

    setHorizonAmount(
      messages.filter(({ index }) => {
        if (index > lastReadIndex && !showIndex) {
          showIndex = index;
        }
        return index > lastReadIndex;
      }).length
    );

    setShowHorizonIndex(showIndex);
  }, [messages, lastReadIndex]);

  function setTopPadding (index) {
    if (
      props.messages[index] !== undefined &&
      props.messages[index - 1] !== undefined &&
      props.messages[index].author === props.messages[index - 1].author
    ) {
      return "0px";
    }
    return "10px";
  }

  const onDownloadAttachment = async (message) => {
    setFileLoading(Object.assign({}, fileLoading, { [message.sid]: true }));
    const blob = await getBlobFile(message.media);
    dispatch(addAttachment(props.conversation.sid, message.sid, blob));
    setFileLoading(Object.assign({}, fileLoading, { [message.sid]: false }));
  };

  const onFileOpen = (file, { filename }) => {
    saveAs(file, filename);
  };

  return (
    <>
      {messages.map((message, index) => {
        const isImage = message.media?.contentType?.includes("image");
        const fileBlob = conversationAttachments?.[message.sid] ?? null;

        return (
          <div
            key={
              message.dateCreated.getTime() +
              message.body +
              message.media?.filename +
              message.sid
            }
          >
            {lastReadIndex !== -1 &&
            horizonAmount &&
            showHorizonIndex === message.index ? (
                <Horizon ref={myRef} amount={horizonAmount} />
              ) : null}
            <MessageView
              reactions={message.attributes["reactions"]}
              message={
                message.body ||
                (message.media ? (
                  <MessageFile
                    key={message.sid}
                    media={message.media}
                    type="view"
                    onDownload={() => onDownloadAttachment(message)}
                    isImage={isImage}
                    file={fileBlob}
                    sending={message.index === -1}
                    loading={fileLoading[message.sid]}
                    onOpen={
                      isImage && fileBlob
                        ? () => setImagePreview({
                          message,
                          file: fileBlob
                        })
                        : () => onFileOpen(
                          conversationAttachments?.[message.sid],
                          message.media
                        )
                    }
                  />
                ) : (
                  ""
                ))
              }
              author={message.author}
              getStatus={getMessageStatus(
                props.conversation,
                message,
                props.participants
              )}
              onDeleteMessage={async () => {
                try {
                  await message.remove();
                  console.log("Message deleted");
                } catch (error) {
                  console.log(error);
                }
              }}
              topPadding={setTopPadding(index)}
              lastMessageBottomPadding={index === messagesLength - 1 ? 16 : 0}
              sameAuthorAsPrev={setTopPadding(index) !== "0px"}
              messageTime={getMessageTime(message)}
              updateAttributes={(attribute) => message.updateAttributes({
                ...message.attributes,
                ...attribute
              })
              }
            />
          </div>
        );
      })}
    </>
  );
};

export default MessageList;
