// @packages
import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuButton,
  useMenuState
} from "@twilio-paste/menu";
import {
  MediaObject,
  MediaFigure,
  MediaBody
} from "@twilio-paste/media-object";
import { Text } from "@twilio-paste/text";
import { MoreVertical, ArrowLeft as ArrowBackIcon, User, Bell } from "react-feather";

// @scripts
import { NOTIFICATION_LEVEL } from "./Constants";

const SettingsMenu = (
  props
) => {
  const menu = useMenuState();
  const { friendlyName, notificationLevel } = props.conversation;
  const muted = notificationLevel === NOTIFICATION_LEVEL.MUTED;

  const toggleMuteConversation = () => {
    props.conversation.setUserNotificationLevel(
      muted
        ? (NOTIFICATION_LEVEL.DEFAULT)
        : (NOTIFICATION_LEVEL.MUTED)
    );
  };

  return (
    <div style={{
      zIndex: 1,
      paddingTop: 8,
      backgroundColor: "white"
    }}>
      <MenuButton {...menu} variant="link" size="reset">
        <MoreVertical title="Settings" />
      </MenuButton>
      <Menu {...menu} aria-label="Preferences">
        <MenuItem {...menu}>
          <MediaObject verticalAlign="center" onClick={toggleMuteConversation}>
            <Bell 
              spacing="space20"
              color={muted ? "gray" : "black"}
              size={16}
            >
              {muted ? 'Unmute' : 'Mute'}
            </Bell>
            <MediaBody>{muted ? "Unmute" : "Mute"} Conversation</MediaBody>
          </MediaObject>
        </MenuItem>
        <MenuItem {...menu} onClick={props.onParticipantListOpen}>
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <User
                size={16}
                decorative={false}
                title="information"
                color='black'
              />
            </MediaFigure>
            <MediaBody>Manage Participants</MediaBody>
          </MediaObject>
        </MenuItem>
        <MenuSeparator {...menu} />
        <MenuItem {...menu} onClick={props.leaveConvo}>
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <ArrowBackIcon
                size={16}
                decorative={false}
                title="information"
                color='black'
              />
            </MediaFigure>
            <MediaBody>
              <Text as="span" color="colorTextError">
                Leave Conversation
              </Text>
            </MediaBody>
          </MediaObject>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default SettingsMenu;
