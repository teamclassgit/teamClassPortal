// @packages
import Proptypes from "prop-types";
import React, { createRef } from "react";
import { Modal, ModalHeader } from "reactstrap";

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
      initialFocusRef={nameInputRef}
      isOpen={isModalOpen}
      onDismiss={handleClose}
      size="default"
      toggle={handleClose}
    >
      <ModalHeader>
        {title}
      </ModalHeader>
      {modalBody}
      {modalFooter}
    </Modal>
  );
};

ConvoModal.propTypes = {
  handleClose: Proptypes.func.isRequired,
  isModalOpen: Proptypes.bool.isRequired,
  modalBody: Proptypes.node.isRequired,
  modalFooter: Proptypes.node,
  title: Proptypes.string.isRequired
};

export default ConvoModal;
