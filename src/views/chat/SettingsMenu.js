// @packages
import React, { useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { MoreVertical, ArrowLeft as ArrowBackIcon, User, Bell } from "react-feather";
import {
  MediaObject,
  MediaFigure,
  MediaBody
} from "@twilio-paste/media-object";
import Proptypes from "prop-types";

// @scripts
import { NOTIFICATION_LEVEL } from "./Constants";

// @styles
import './SettingsMenu.scss';

const SettingsMenu = ({
  conversation,
  onParticipantListOpen,
  leaveConvo
}) => {
  const { notificationLevel } = conversation;
  const muted = notificationLevel === NOTIFICATION_LEVEL.MUTED;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMuteConversation = () => {
    conversation.setUserNotificationLevel(
      muted
        ? (NOTIFICATION_LEVEL.DEFAULT)
        : (NOTIFICATION_LEVEL.MUTED)
    );
  };

  const toogleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="settings-menu-container">
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
            className="settings-icon"
          >
            <MediaObject verticalAlign="center">
              <Bell 
                className="settings-item"
                color={muted ? "gray" : "black"}
                size={16}
              >
                {muted ? 'Unmute' : 'Mute'}
              </Bell>
              <MediaBody>{muted ? "Unmute" : "Mute"} Conversation</MediaBody>
            </MediaObject>
          </DropdownItem>
          <DropdownItem 
            className="settings-icon"
            onClick={onParticipantListOpen}
          >
            <MediaObject verticalAlign="center">
              <MediaFigure >
                <User
                  className="settings-item"
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
            onClick={leaveConvo} 
            className="settings-icon"
          >
            <MediaObject verticalAlign="center">
              <MediaFigure >
                <ArrowBackIcon
                  className="settings-item"
                  size={16}
                  title="information"
                  color='red'
                />
              </MediaFigure>
              <MediaBody>
                <span className="delete-message">
                  Leave Conversation
                </span>
              </MediaBody>
            </MediaObject>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

SettingsMenu.propTypes = {
  conversation: Proptypes.object.isRequired,
  onParticipantListOpen: Proptypes.func.isRequired,
  leaveConvo: Proptypes.func.isRequired
};

export default SettingsMenu;
