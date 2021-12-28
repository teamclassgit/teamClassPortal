// @packages
import { ModalBody } from "reactstrap";

// @scripts
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";
import ModalInputField from "./ModalInputField";

const AddChatParticipantModal = ({
  isModalOpen,
  handleClose,
  title,
  nameInputRef,
  name,
  onBack,
  setName,
  error,
  action
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
                label="User identity"
                isFocused={true}
                input={name}
                placeholder="exampleusername"
                onChange={setName}
                error={error}
                help_text="The identity used by the participant in Conversations."
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
