// @packages
import { ModalBody } from "reactstrap";

// @scripts
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";
import ModalInputField from "./ModalInputField";

const AddSMSParticipantModal = ({
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
            <h3>Add SMS participant</h3>
            <div>
              <ModalInputField
                error={error}
                help_text="The phone number of the participant."
                input={name}
                isFocused={true}
                label="Phone number"
                onChange={setName}
                placeholder="123456789012"
                prefixType="SMS"
              />
              <ModalInputField
                error={errorProxy}
                help_text="The Twilio phone number used by the participant in Conversations."
                input={proxyName}
                label="Proxy phone number"
                onChange={setProxyName}
                placeholder="123456789012"
                prefixType="SMS"
              />
            </div>
          </ModalBody>
        }
        modalFooter={
          <AddParticipantFooter
            action={action}
            actionName={ActionName.Save}
            isSaveDisabled={!name || !proxyName || !!error}
            onBack={onBack}
          />
        }
      />
    </>
  );
};

export default AddSMSParticipantModal;
