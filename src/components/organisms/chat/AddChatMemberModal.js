// @packages
import PropTypes from "prop-types";
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
            <div>
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
            action={action}
            actionName='Save'
            isSaveDisabled={!name.trim() || !!error}
            onBack={onBack}
          />
        }
      />
    </>
  );
};

AddChatParticipantModal.propTypes = {
  action: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  nameInputRef: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};

export default AddChatParticipantModal;
