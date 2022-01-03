// @packages
import { ModalBody } from "reactstrap";

// @scripts
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";
import ModalInputField from "./ModalInputField";

const AddChatParticipantModal = ({
  action,
  error,
  handleClose,
  isModalOpen,
  name,
  onBack,
  setName,
  title
}) => {
  return (
    <>
      <ConvoModal
        handleClose={() => handleClose()}
        isModalOpen={isModalOpen}
        title={title}
        modalBody={
          <ModalBody>
            <h3>Add Chat participant</h3>
            <div as="form">
              <ModalInputField
                error={error}
                help_text="The identity used by the participant in Conversations."
                input={name}
                isFocused={true}
                label="User identity"
                onChange={setName}
                placeholder="exampleusername"
              />
            </div>
          </ModalBody>
        }
        modalFooter={
          <AddParticipantFooter
            isSaveDisabled={!name.trim() || !!error}
            actionName={'save'}
            onBack={() => {
              onBack();
            }}
            action={action}
          />
        }
      />
    </>
  );
};

export default AddChatParticipantModal;
