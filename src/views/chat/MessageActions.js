import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuSeparator,
  useMenuState
} from "@twilio-paste/menu";
import { MoreVertical, Copy, Delete } from 'react-feather';
import {
  MediaBody,
  MediaFigure,
  MediaObject
} from "@twilio-paste/media-object";
import { Text } from "@twilio-paste/text";
import { Toaster, useToaster } from "@twilio-paste/core";
import { COPY_SUCCESS_MESSAGE } from "./Constants";

const MessageActions = ({
  messageText,
  onMessageDelete
}) => {
  const menu = useMenuState();
  const toaster = useToaster();

  return (
    <div
      style={{
        zIndex: 6,
        paddingLeft: 6
      }}
    >
      <Toaster {...toaster} />
      <MenuButton {...menu} variant="link" size="reset">
        <MoreVertical
          decorative={false}
          title="Settings"
          color='white'
        />
      </MenuButton>
      <Menu {...menu} aria-label="MessageActions">
        {messageText ? (
          <>
            <MenuItem
              {...menu}
              onClick={() => {
                navigator.clipboard.writeText(messageText);
                toaster.push({
                  message: COPY_SUCCESS_MESSAGE,
                  variant: "success"
                });
                menu.hide();
              }}
            >
              <MediaObject verticalAlign="center">
                <MediaFigure spacing="space20">
                  <Copy
                    decorative={false}
                    title="Copy"
                    color='black'
                  />
                </MediaFigure>
                <MediaBody>Copy</MediaBody>
              </MediaObject>
            </MenuItem>
            <MenuSeparator {...menu} />
          </>
        ) : null}
        <MenuItem {...menu} onClick={onMessageDelete}>
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <Delete
                decorative={false}
                title="Delete"
                color='black'
              />
            </MediaFigure>
            <MediaBody>
              <Text as="span" color="colorTextErrorStrong">
                Delete Message
              </Text>
            </MediaBody>
          </MediaObject>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MessageActions;
