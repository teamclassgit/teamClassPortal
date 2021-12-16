import { createRef } from "react";
import { Modal, ModalHeader } from "reactstrap";

const ConvoModal = (props) => {
  const nameInputRef = createRef();

  return (
    <Modal
      ariaLabelledby="add-convo-modal"
      isOpen={props.isModalOpen}
      onDismiss={() => props.handleClose()}
      initialFocusRef={nameInputRef}
      size="default"
    >
      <ModalHeader>
        {props.title}
      </ModalHeader>
      {props.modalBody}
      {props.modalFooter}
    </Modal>
  );
};

export default ConvoModal;
