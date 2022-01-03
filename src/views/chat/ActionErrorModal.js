// @packages
import React from "react";
import { Button, ModalBody, Modal, ModalFooter, ModalHeader } from "reactstrap";
import {
  ModalFooterActions,
  ModalHeading
} from "@twilio-paste/modal";

const ActionErrorModal = ({
  error,
  errorText,
  isOpened,
  onClose
}) => (
  <Modal
    ariaLabelledby="name-change-error"
    isOpen={isOpened}
    onDismiss={onClose}
    size="default"
  >
    <ModalHeader>
      <ModalHeading as="h3">{errorText.title}</ModalHeading>
    </ModalHeader>
    <ModalBody>
      <div>
        {errorText.description}
        {error ? (
          <>
            <br />
            <br />
            Error code [{error.code}]: {error.message}
          </>
        ) : null}
      </div>
    </ModalBody>
    <ModalFooter>
      <ModalFooterActions>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooterActions>
    </ModalFooter>
  </Modal>
);

export default ActionErrorModal;
