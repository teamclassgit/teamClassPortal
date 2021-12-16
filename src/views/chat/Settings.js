// @packages
import React, { useState, createRef } from "react";
import { Spinner } from "reactstrap";

// @scripts
import AddChatParticipantModal from "./AddChatMemberModal";
import AddSMSParticipantModal from "./AddSMSParticipantModal";
import AddWhatsAppParticipantModal from "./AddWhatsAppParticipantModal";
import ManageParticipantsModal from "./ManageParticipantsModal";
import SettingsMenu from "./SettingsMenu";
import { addParticipant, removeParticipant } from "./Apis";
import {
  successNotification,
  unexpectedErrorNotification
} from "./helpers";
import {
  updateCurrentConversation,
  updateConversation, 
  addNotifications
} from "../../redux/actions/chat";
import {
  CONVERSATION_MESSAGES,
  SMS_PREFIX,
  WHATSAPP_PREFIX
} from "./Constants";

const Settings = (props) => {
  const [error, setError] = useState("");
  const [errorProxy, setErrorProxy] = useState("");
  const [isAddChatOpen, setIsAddChatOpen] = useState(false);
  const [isAddSMSOpen, setIsAddSMSOpen] = useState(false);
  const [isAddWhatsAppOpen, setIsAddWhatsAppOpen] = useState(false);
  const [isLoading] = useState(false);
  const [isManageParticipantOpen, setIsManageParticipantOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameProxy, setNameProxy] = useState("");

  const handleChatOpen = () => setIsAddChatOpen(true);
  const handleChatClose = () => setIsAddChatOpen(false);
  const handleParticipantClose = () => setIsManageParticipantOpen(false);
  const handleSMSOpen = () => setIsAddSMSOpen(true);
  const handleSMSClose = () => setIsAddSMSOpen(false);
  const handleWhatsAppOpen = () => setIsAddWhatsAppOpen(true);
  const handleWhatsAppClose = () => setIsAddWhatsAppOpen(false);

  const nameInputRef = createRef();

  const emptyData = () => {
    setName("");
    setNameProxy("");
    setError("");
    setErrorProxy("");
  };

  const setErrors = (errorText) => {
    setError(errorText);
    setErrorProxy(errorText);
  };

  return (
    <>
      <SettingsMenu
        onParticipantListOpen={() => setIsManageParticipantOpen(true)}
        leaveConvo={async () => {
          try {
            await props.convo.leave();
            successNotification({
              message: CONVERSATION_MESSAGES.LEFT,
              addNotifications
            });
            updateCurrentConversation("");
          } catch {
            unexpectedErrorNotification(addNotifications);
          }
        }}
        updateConvo={(val) => props.convo
          .updateFriendlyName(val)
          .then((convo) => {
            updateConversation(convo.sid, convo);
            successNotification({
              message: CONVERSATION_MESSAGES.NAME_CHANGED,
              addNotifications
            });
          })
          .catch((e) => {
            console.log(e);
          })
        }
        conversation={props.convo}
        addNotifications={addNotifications}
      />
      {isManageParticipantOpen && (
        <ManageParticipantsModal
          handleClose={handleParticipantClose}
          isModalOpen={isManageParticipantOpen}
          title="Manage Participants"
          participantsCount={props.participants.length}
          participantsList={props.participants}
          onClick={(content) => {
            handleParticipantClose();
            switch (content) {
            case Content.AddSMS:
              handleSMSOpen();
              return null;
            case Content.AddWhatsApp:
              handleWhatsAppOpen();
              return null;
            case Content.AddChat:
              handleChatOpen();
              return null;
            default:
              return null;
            }
          }}
          onParticipantRemove={async (participant) => {
            await removeParticipant(props.convo, participant, addNotifications);
          }}
        />
      )}
      {isAddSMSOpen && (
        <AddSMSParticipantModal
          name={name}
          proxyName={nameProxy}
          isModalOpen={isAddSMSOpen}
          title="Manage Participants"
          setName={(name) => {
            setName(name);
            setErrors("");
          }}
          setProxyName={(name) => {
            setNameProxy(name);
            setErrors("");
          }}
          error={error}
          errorProxy={errorProxy}
          nameInputRef={nameInputRef}
          handleClose={() => {
            emptyData();
            handleSMSClose();
          }}
          onBack={() => {
            emptyData();
            handleSMSClose();
            setIsManageParticipantOpen(true);
          }}
          action={async () => {
            try {
              await addParticipant(
                SMS_PREFIX + name,
                SMS_PREFIX + nameProxy,
                false,
                props.convo,
                addNotifications
              );
              emptyData();
              handleSMSClose();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      )}
      {isAddWhatsAppOpen && (
        <AddWhatsAppParticipantModal
          name={name}
          proxyName={nameProxy}
          isModalOpen={isAddWhatsAppOpen}
          title="Manage Participants"
          setName={(name) => {
            setName(name);
            setErrors("");
          }}
          setProxyName={(name) => {
            setNameProxy(name);
            setErrors("");
          }}
          error={error}
          errorProxy={errorProxy}
          nameInputRef={nameInputRef}
          handleClose={() => {
            emptyData();
            handleWhatsAppClose();
          }}
          onBack={() => {
            emptyData();
            handleWhatsAppClose();
            setIsManageParticipantOpen(true);
          }}
          action={async () => {
            try {
              await addParticipant(
                WHATSAPP_PREFIX + name,
                WHATSAPP_PREFIX + nameProxy,
                false,
                props.convo,
                addNotifications
              );
              emptyData();
              handleWhatsAppClose();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      )}
      {isAddChatOpen && (
        <AddChatParticipantModal
          name={name}
          isModalOpen={isAddChatOpen}
          title="Manage Participants"
          setName={(name) => {
            setName(name);
            setErrors("");
          }}
          error={error}
          nameInputRef={nameInputRef}
          handleClose={() => {
            emptyData();
            handleChatClose();
          }}
          onBack={() => {
            emptyData();
            handleChatClose();
            setIsManageParticipantOpen(true);
          }}
          action={async () => {
            try {
              await addParticipant(
                name,
                nameProxy,
                true,
                props.convo,
                addNotifications
              );
              emptyData();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      )}
      {isLoading ? (
        <div
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          height="100%"
          width="100%"
        >
          <Spinner size='20' decorative={false} title="Loading" />
        </div>
      ) : null}
    </>
  );
};

export default Settings;
