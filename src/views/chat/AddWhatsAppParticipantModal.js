// @packages
import { ModalBody, Box } from "@twilio-paste/core";

// @scripts
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";
import ModalInputField from "./ModalInputField";

const AddWhatsAppParticipantModal =
  (props) => {
    return (
      <>
        <ConvoModal
          handleClose={() => props.handleClose()}
          isModalOpen={props.isModalOpen}
          title={props.title}
          modalBody={
            <ModalBody>
              <h3>Add WhatsApp participant</h3>
              <Box as="form">
                <ModalInputField
                  error={props.error}
                  help_text="The WhatsApp phone number of the participant."
                  input={props.name}
                  isFocused={true}
                  label="WhatsApp number"
                  onChange={props.setName}
                  placeholder="123456789012"
                  prefixType="WhatsApp"
                />
                <ModalInputField
                  error={props.errorProxy}
                  help_text="The Twilio phone number used by the participant in Conversations."
                  input={props.proxyName}
                  label="Proxy phone number"
                  onChange={props.setProxyName}
                  placeholder="123456789012"
                  prefixType="WhatsApp"
                />
              </Box>
            </ModalBody>
          }
          modalFooter={
            <AddParticipantFooter
              isSaveDisabled={
                !props.name.trim() || !props.proxyName.trim() || !!props.error
              }
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

export default AddWhatsAppParticipantModal;
