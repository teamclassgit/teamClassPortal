// @packages
import React, { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuSeparator,
  useMenuState
} from "@twilio-paste/menu";
import {
  MediaObject,
  MediaFigure,
  MediaBody
} from "@twilio-paste/media-object";
import { Text } from "@twilio-paste/text";
import { MoreVertical, ArrowLeft as ArrowBackIcon, Edit, User } from "react-feather";

// @scripts
import ConversationTitleModal from "./ConversationTitleModal";
import { NOTIFICATION_LEVEL } from "./Constants";
import { unexpectedErrorNotification } from "./helpers";

const SettingsMenu = (
  props
) => {
  const menu = useMenuState();
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
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
        <div style={{
          position: 'relative',
          left: -20
        }}>
          <MenuItem {...menu}>
            <MediaObject verticalAlign="center">
              <MediaFigure spacing="space20">
                <Edit
                  title="edit"
                  color="colorTextIcon"
                />
              </MediaFigure>
              <MediaBody onClick={() => setIsTitleModalOpen(true)}>
                Edit Conversation name
              </MediaBody>
              <ConversationTitleModal
                title={friendlyName}
                type="edit"
                isModalOpen={isTitleModalOpen}
                onCancel={() => {
                  setIsTitleModalOpen(false);
                }}
                onSave={async (title) => {
                  try {
                    await props.updateConvo(title);
                  } catch {
                    unexpectedErrorNotification(props.addNotifications);
                  }
                  setIsTitleModalOpen(false);
                }}
              />
            </MediaObject>
          </MenuItem>
        </div>
        <MenuItem {...menu}>
          <MediaObject verticalAlign="center" onClick={toggleMuteConversation}>
            <MediaFigure spacing="space20">
              {muted ? 'Unmute' : 'Mute'}
            </MediaFigure>
            <MediaBody>{muted ? "Unmute" : "Mute"} Conversation</MediaBody>
          </MediaObject>
        </MenuItem>
        <MenuItem {...menu} onClick={props.onParticipantListOpen}>
          <MediaObject verticalAlign="center">
            <MediaFigure spacing="space20">
              <User
                decorative={false}
                title="information"
                color="colorTextIcon"
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
                decorative={false}
                title="information"
                color="colorTextError"
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
