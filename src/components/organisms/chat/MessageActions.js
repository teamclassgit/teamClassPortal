// @packages
import Proptypes from "prop-types";
import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { MediaBody, MediaFigure, MediaObject } from "@twilio-paste/media-object";
import { MoreVertical, Copy, Delete } from "react-feather";

// @styles
import "./MessageActions.scss";

const MessageActions = ({
  messageText,
  onMessageDelete
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="message-actions-container">
      <Dropdown 
        direction="left"
        isOpen={dropdownOpen} 
        toggle={toggle} 
      >
        <DropdownToggle nav>
          <MoreVertical
            title="Settings"
            color='black'
            size={20}
          />
        </DropdownToggle>
        <DropdownMenu>
          {messageText ? (
            <>
              <DropdownItem
                className="message-text-item"
                onClick={() => {
                  navigator.clipboard.writeText(messageText);
                  setDropdownOpen(false);
                }}
              >
                <MediaObject >
                  <MediaFigure>
                    <Copy
                      title="Copy"
                      color='black'
                    />
                  </MediaFigure>
                  <MediaBody>
                    <span className="message-text">
                      Copy
                    </span>
                  </MediaBody>
                </MediaObject>
              </DropdownItem>
              <DropdownItem divider />
            </>
          ) : null}
          <DropdownItem onClick={() => onMessageDelete()}>
            <MediaObject >
              <MediaFigure>
                <Delete
                  color="red"
                  title="Delete"
                />
              </MediaFigure>
              <MediaBody>
                <span className="delete-message">
                  Delete Message
                </span>
              </MediaBody>
            </MediaObject>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

MessageActions.propTypes = {
  messageText: Proptypes.string.isRequired,
  onMessageDelete: Proptypes.func.isRequired
};

export default MessageActions;