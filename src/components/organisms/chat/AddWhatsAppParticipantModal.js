/* eslint-disable no-undef */
// @packages
import { ModalBody } from "reactstrap";

// @scripts
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";
import ModalInputField from "./ModalInputField";

const AddWhatsAppParticipantModal = ({
  action,
  error,
  errorProxy,
  handleClose,
  isModalOpen,
  name,
  onBack,
  proxyName,
  setName,
  setProxyName,
  title
}) => {
  return (
    <>
      <ConvoModal
        handleClose={handleClose}
        isModalOpen={isModalOpen}
        title={title}
        modalBody={
          <ModalBody>
            <h3>Add WhatsApp participant</h3>
            <div as="form">
              <ModalInputField
                error={error}
                help_text="The WhatsApp phone number of the participant."
                input={name}
                isFocused={true}
                label="WhatsApp number"
                onChange={setName}
                placeholder="123456789012"
                prefixType="WhatsApp"
              />
              <ModalInputField
                error={errorProxy}
                help_text="The Twilio phone number used by the participant in Conversations."
                input={proxyName}
                label="Proxy phone number"
                onChange={setProxyName}
                placeholder="123456789012"
                prefixType="WhatsApp"
              />
            </div>
          </ModalBody>
        }
        modalFooter={
          <AddParticipantFooter
            action={action}
            actionName={ActionName.Save}
            isSaveDisabled={!name.trim() || !proxyName.trim() || !!error}
            onBack={onBack}
          />
        }
      />
    </>
  );
};

export default AddWhatsAppParticipantModal;
