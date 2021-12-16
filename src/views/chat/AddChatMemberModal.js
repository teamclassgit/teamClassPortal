import { ModalBody } from "reactstrap";
import ModalInputField from "./ModalInputField";
import AddParticipantFooter from "./AddParticipantFooter";
import ConvoModal from "./ConvoModal";

const AddChatParticipantModal = (
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
            <h3>Add Chat participant</h3>
            <div as="form">
              <ModalInputField
                label="User identity"
                isFocused={true}
                input={props.name}
                placeholder="exampleusername"
                onChange={props.setName}
                error={props.error}
                // error_text="Enter a valid user identity."
                help_text="The identity used by the participant in Conversations."
              />
            </div>
          </ModalBody>
        }
        modalFooter={
          <AddParticipantFooter
            isSaveDisabled={!props.name.trim() || !!props.error}
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

export default AddChatParticipantModal;
