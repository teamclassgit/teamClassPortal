// @packages
import { Button, Input } from "reactstrap";
import { Paperclip } from 'react-feather';
import { debounce } from "lodash";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

// @scripts
import MessageInput from "./MessageInput";
import SendMessageButton from "./SendMessageButton";
import { MAX_FILE_SIZE } from "./Constants";
import { unexpectedErrorNotification } from "./helpers";
import {
  addMessages
} from '../../redux/actions/chat';

const MessageInputField = (props) => {
  const [files, setFiles] = useState([]);
  const [filesInputKey, setFilesInputKey] = useState("input-key");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setMessage("");
    setFiles([]);
    setFilesInputKey(Date.now().toString());
  }, []);

  useEffect(() => {
    if (!files.length) {
      setFilesInputKey(Date.now().toString());
    }
  }, [files]);

  const onFilesChange = (event) => {
    const { files: assets } = event.target;
    if (!assets?.length) {
      return;
    }

    const validFiles = Array.from(assets).filter(
      ({ size }) => size < MAX_FILE_SIZE + 1
    );

    if (validFiles.length < assets.length) {
      // TODO: show error
    }

    setFiles([...files, ...validFiles]);
  };

  const onFileRemove = (file) => {
    const fileIdentity = file.split("_");
    const existentFiles = files.filter(
      ({ name, size }) => name !== fileIdentity[0] && size !== Number(fileIdentity[1])
    );

    setFiles(existentFiles);
  };

  const onMessageSend = async () => {
    const { convo, client, messages } = props;
    const messagesToSend = [];
    const messagesData = [];
    const currentDate = new Date();

    if (message) {
      const newMessage = Object.assign({}, messages[messages.length], {
        ...(messages[messages.length]),
        author: client.user.identity,
        body: message,
        attributes: {},
        dateCreated: currentDate,
        index: -1,
        participantSid: "",
        sid: convo.sid,
        aggregatedDeliveryReceipt: null
      });
      messagesToSend.push(newMessage);
      messagesData.push(message);
    }

    for (const file of files) {
      const newMessage = Object.assign({}, messages[messages.length], {
        ...(messages[messages.length]),
        author: client.user.identity,
        body: null,
        attributes: {},
        dateCreated: currentDate,
        index: -1,
        participantSid: "",
        sid: convo.sid,
        aggregatedDeliveryReceipt: null,
        media: {
          size: file.size,
          filename: file.name,
          contentType: file.type
        }
      });
      messagesToSend.push(newMessage);
      const fileData = new FormData();
      fileData.set(file.name, file, file.name);
      messagesData.push(fileData);
    }

    dispatch(addMessages(convo.sid, messagesToSend));
    setMessage("");
    setFiles([]);

    try {
      const indexes = [];
      for (const msg of messagesData) {
        const index = await convo.sendMessage(msg);
        indexes.push(index);
      }
      await convo.updateLastReadMessageIndex(Math.max(...indexes));
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        display:"flex",
        flexBasis: "30px",
        flexDirection:"column",
        flexGrow: 10
      }}
    >
      <div
        style={{
          display:"flex",
          flexDirection:"row",
          height:"100%",
          paddingBottom: "10px",
          paddingTop: "10px"
        }}
      >
        <div
          style={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"flex-start",
            alignItems:"start",
            cursor: 'pointer'
          }}
        >
          <Button size='xs' color='transparent'>
            <label htmlFor="file-input">
              <Paperclip
                size="20"
                title="Attach file"
                color="black"
              />
            </label>
            <Input
              id="file-input"
              key={filesInputKey}
              type="file"
              style={{ display: "none", cursor: 'pointer' }}
              onChange={onFilesChange}
            />
          </Button>
        </div>
        <div style={{
          paddingRight: "10px",
          flexGrow: 10
        }}>
          <MessageInput
            assets={files}
            message={message}
            onChange={(e) => {
              debounce(() => {
                props.convo.typing();
              }, 2000)();
              setMessage(e);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onMessageSend();
              }
            }}
            onFileRemove={onFileRemove}
          />
        </div>
        <div
          style={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"flex-start",
            alignItems:"start",
            backgroundColor:"white"
          }}
        >
          {message || files.length ? (
            <SendMessageButton message={message} onClick={onMessageSend} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MessageInputField;
