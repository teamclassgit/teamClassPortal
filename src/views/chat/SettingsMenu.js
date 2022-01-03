// @packages
import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {
  MediaObject,
  MediaFigure,
  MediaBody
} from "@twilio-paste/media-object";
import { MoreVertical, ArrowLeft as ArrowBackIcon, User, Bell } from "react-feather";
import { Text } from "@twilio-paste/text";

// @scripts
import { NOTIFICATION_LEVEL } from "./Constants";

const SettingsMenu = (
  props
) => {
  const { notificationLevel } = props.conversation;
  const muted = notificationLevel === NOTIFICATION_LEVEL.MUTED;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMuteConversation = () => {
    props.conversation.setUserNotificationLevel(
      muted
        ? (NOTIFICATION_LEVEL.DEFAULT)
        : (NOTIFICATION_LEVEL.MUTED)
    );
  };

  const toogleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div style={{
      zIndex: 1,
      backgroundColor: "white"
    }}>
      <Dropdown 
        isOpen={dropdownOpen} 
        toggle={toogleDropdown} 
      >
        <DropdownToggle nav>
          <MoreVertical title="Settings" color="black"/>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem 
            onClick={toggleMuteConversation} 
            style={{
              width: '100%'
            }}
          >
            <MediaObject verticalAlign="center">
              <Bell 
                style={{
                  marginRight: "0.5rem"
                }}
                color={muted ? "gray" : "black"}
                size={16}
              >
                {muted ? 'Unmute' : 'Mute'}
              </Bell>
              <MediaBody>{muted ? "Unmute" : "Mute"} Conversation</MediaBody>
            </MediaObject>
          </DropdownItem>
          <DropdownItem 
            onClick={props.onParticipantListOpen}
            style={{
              width: '100%'
            }}
          >
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="space20">
                <User
                  style={{
                    marginRight: "0.5rem"
                  }}
                  size={16}
                  title="information"
                  color='black'
                />
              </MediaFigure>
              <MediaBody>Manage Participants</MediaBody>
            </MediaObject>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem 
            onClick={props.leaveConvo} 
            style={{
              width: '100%'
            }}
          >
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="space20">
                <ArrowBackIcon
                  style={{
                    marginRight: "0.5rem"
                  }}
                  size={16}
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
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default SettingsMenu;
