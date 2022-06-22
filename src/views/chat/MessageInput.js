// @packages
import Proptypes from "prop-types";
import React, { useState, useLayoutEffect } from "react";
import { Input } from 'reactstrap';

// @scripts
import MessageFile from "./MessageFile";

// @styles
import './MessageInput.scss';

const useWindowSize = () => {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize () {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

const getTextWidth = (text) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context !== null && context !== undefined) {
    context.font = "14px Inter";
    return context.measureText(text).width;
  }
  return 0;
};

const MessageInput = ({
  assets,
  message,
  onChange,
  onFileRemove,
  onKeyPress
}) => {
  const [cursorPosition, setCursorPostions] = useState(0);
  const width = useWindowSize();

  const onChangeHandler = (e) => {
    setCursorPostions(e.currentTarget.selectionStart);
    onChange(e.currentTarget.value);
  };

  return (
    <div className="message-input-container">
      {getTextWidth(message) < width - 500 && (
        <Input
          aria-describedby="message_help_text"
          autoFocus
          className="message-input"
          id="message-input-shorter"
          name="message-input-shorter"
          onChange={(e) => onChangeHandler(e)}
          placeholder="Add your message"
          type="text"
          value={message}
          style={{
            border: assets.length ? "none" : "1px solid #8891AA",
            margin: `${
              `0 6px ${  assets.length ? "12" : "4"  }px 6px`
            }`
          }}
          onFocus={(e) => e.currentTarget.setSelectionRange(cursorPosition, cursorPosition)}
          onKeyPress={onKeyPress}
        />
      )}

      {getTextWidth(message) >= width - 500 && (
        <textarea
          onChange={(e) => onChangeHandler(e)}
          aria-describedby="message_help_text"
          id="message-input"
          name="message-input"
          value={message}
          autoFocus
          onFocus={(e) => e.currentTarget.setSelectionRange(cursorPosition, cursorPosition)
          }
        />
      )}
      {assets.length ? (
        <div className="message-input-assets" >
          {assets.map(({ name, size }) => (
            <MessageFile
              key={`${`${name  }_${  size}`}`}
              media={{ filename: name, size }}
              onRemove={() => onFileRemove(`${name  }_${  size}`)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

MessageInput.propTypes = {
  assets: Proptypes.array.isRequired,
  message: Proptypes.string.isRequired,
  onChange: Proptypes.func.isRequired,
  onFileRemove: Proptypes.func.isRequired,
  onKeyPress: Proptypes.func.isRequired
};

export default MessageInput;
