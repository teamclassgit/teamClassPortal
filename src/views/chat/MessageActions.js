// @packages
import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { MoreVertical, Copy, Delete } from 'react-feather';
import { Text } from "@twilio-paste/text";
import { Toaster, useToaster } from "@twilio-paste/core";
import {
  MediaBody,
  MediaFigure,
  MediaObject
} from "@twilio-paste/media-object";

// @scripts
import { COPY_SUCCESS_MESSAGE } from "./Constants";

const MessageActions = ({
  messageText,
  onMessageDelete
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toaster = useToaster();

  const toggle = () => setDropdownOpen(!dropdownOpen);

  return (
    <div
      style={{
        paddingLeft: 6,
        zIndex: 6
      }}
    >
      <Dropdown 
        isOpen={dropdownOpen} 
        toggle={toggle} 
        direction="left"
      >
        <Toaster {...toaster} />
        <DropdownToggle nav>
          <MoreVertical
            title="Settings"
            color='white'
          />
        </DropdownToggle>
        <DropdownMenu>
          {messageText ? (
            <>
              <DropdownItem
                onClick={() => {
                  navigator.clipboard.writeText(messageText);
                  toaster.push({
                    message: COPY_SUCCESS_MESSAGE,
                    variant: "success"
                  });
                  setDropdownOpen(false);
                }}
                style={{
                  width: "100%"
                }}
              >
                <MediaObject verticalAlign="center">
                  <MediaFigure spacing="0.25rem">
                    <Copy
                      title="Copy"
                      color='black'
                    />
                  </MediaFigure>
                  <MediaBody>
                    <Text as="span">
                      Copy
                    </Text>
                  </MediaBody>
                </MediaObject>
              </DropdownItem>
              <DropdownItem divider />
            </>
          ) : null}
          <DropdownItem onClick={onMessageDelete}>
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="0.25rem">
                <Delete
                  title="Delete"
                  color='red'
                />
              </MediaFigure>
              <MediaBody>
                <Text as="span" color="red">
                  Delete Message
                </Text>
              </MediaBody>
            </MediaObject>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default MessageActions;