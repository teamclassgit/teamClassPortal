// @packages
import { ModalBody, Box } from "@twilio-paste/core";

// @scripts
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";
import ModalInputField from "./ModalInputField";

const AddSMSParticipantModal = (
  props
) => {
  return (
    <>
      <ConvoModal
        handleClose={() => props.handleClose()}
        isModalOpen={props.isModalOpen}
        title={props.title}
        modalBody={
          <ModalBody>
            <h3>Add SMS participant</h3>
            <Box as="form">
              <ModalInputField
                error={props.error}
                help_text="The phone number of the participant."
                input={props.name}
                isFocused={true}
                label="Phone number"
                onChange={props.setName}
                placeholder="123456789012"
                prefixType="SMS"
              />
              <ModalInputField
                error={props.errorProxy}
                help_text="The Twilio phone number used by the participant in Conversations."
                input={props.proxyName}
                label="Proxy phone number"
                onChange={props.setProxyName}
                placeholder="123456789012"
                prefixType="SMS"
              />
            </Box>
          </ModalBody>
        }
        modalFooter={
          <AddParticipantFooter
            isSaveDisabled={!props.name || !props.proxyName || !!props.error}
            actionName={ActionName.Save}
            onBack={() => {
              props.onBack();
            }}
            action={props.action}
          />
        }
      />
    </>
  );
};

export default AddSMSParticipantModal;
