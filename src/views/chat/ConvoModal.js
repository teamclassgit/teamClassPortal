// @packages
import { Modal, ModalHeader } from "reactstrap";
import { createRef } from "react";

const ConvoModal = ({
  handleClose,
  isModalOpen,
  modalBody,
  modalFooter,
  title
}) => {
  const nameInputRef = createRef();

  return (
    <Modal
      ariaLabelledby="add-convo-modal"
      isOpen={isModalOpen}
      onDismiss={() => handleClose()}
      initialFocusRef={nameInputRef}
      size="default"
    >
      <ModalHeader>
        {title}
      </ModalHeader>
      {modalBody}
      {modalFooter}
    </Modal>
  );
};

export default ConvoModal;
