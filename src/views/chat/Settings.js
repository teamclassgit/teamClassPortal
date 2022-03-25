// @packages
import React, { useState, createRef } from "react";
import { Spinner } from "reactstrap";
import { useDispatch } from "react-redux";

// @scripts
import AddChatParticipantModal from "./AddChatMemberModal";
import AddSMSParticipantModal from "./AddSMSParticipantModal";
import AddWhatsAppParticipantModal from "./AddWhatsAppParticipantModal";
import ManageParticipantsModal from "./ManageParticipantsModal";
import SettingsMenu from "./SettingsMenu";
import { addParticipant, removeParticipant } from "./Apis";
import {
  updateCurrentConversation,
  updateConversation, 
  addNotifications,
  informationId
} from "../../redux/actions/chat";
import {
  SMS_PREFIX,
  WHATSAPP_PREFIX
} from "./Constants";

// @styles
import "./Settings.scss";

const Settings = ({
  convo,
  participants
}) => {
  const [error, setError] = useState("");
  const [errorProxy, setErrorProxy] = useState("");
  const [isAddChatOpen, setIsAddChatOpen] = useState(false);
  const [isAddSMSOpen, setIsAddSMSOpen] = useState(false);
  const [isAddWhatsAppOpen, setIsAddWhatsAppOpen] = useState(false);
  const [isLoading] = useState(false);
  const [isManageParticipantOpen, setIsManageParticipantOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameProxy, setNameProxy] = useState("");

  const dispatch = useDispatch();

  const handleChatClose = () => setIsAddChatOpen(false);
  const handleChatOpen = () => setIsAddChatOpen(true);
  const handleParticipantClose = () => setIsManageParticipantOpen(false);
  const handleSMSClose = () => setIsAddSMSOpen(false);
  const handleSMSOpen = () => setIsAddSMSOpen(true);
  const handleWhatsAppClose = () => setIsAddWhatsAppOpen(false);
  const handleWhatsAppOpen = () => setIsAddWhatsAppOpen(true);

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
            await convo.leave();
            dispatch(updateCurrentConversation(""));
            dispatch(informationId(""));
            console.log(`Conversation ${convo.sid} left`);
          } catch (e) {
            console.log(e);
          }
        }}
        updateConvo={(val) => convo
          .updateFriendlyName(val)
          .then((convo) => {
            dispatch(updateConversation(convo.sid, convo));
            console.log(`Conversation ${convo.sid} updated`);
          })
          .catch((e) => {
            console.log(e);
          })
        }
        conversation={convo}
        addNotifications={'addNotifications'}
      />
      {isManageParticipantOpen && (
        <ManageParticipantsModal
          handleClose={handleParticipantClose}
          isModalOpen={isManageParticipantOpen}
          title="Manage Participants"
          participantsCount={participants?.length}
          participantsList={participants}
          onClick={(content) => {
            handleParticipantClose();
            switch (content) {
            case "Add SMS participant":
              handleSMSOpen();
              return null;
            case "Add WhatsApp participant":
              handleWhatsAppOpen();
              return null;
            case "Add chat participant":
              handleChatOpen();
              return null;
            default:
              return null;
            }
          }}
          onParticipantRemove={async (participant) => {
            await removeParticipant(convo, participant);
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
                convo,
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
                convo,
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
                convo
              );
              emptyData();
            } catch (e) {
              console.log(e);
            }
          }}
        />
      )}
      {isLoading && (
        <div className="settings-loading">
          <Spinner size='20' title="Loading" />
        </div>
      )}
    </>
  );
};

export default Settings;
