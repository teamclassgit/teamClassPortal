// @packages
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Alert,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

// @scripts
import { verifySentEmailSystemStatus } from "../../../services/EmailService";

const ConfirmSystemStatusToVerified = ({toggle, selectedDocumentsIds, onEditCompleted, setSelected }) => {
  const [closingBookingsInProcess, setClosingBookingsInProcess] = useState(false);
  const [isCatchError, setIsCatchError] = useState(false);

  const updateClosedStatus = async () => {

    try {
      setClosingBookingsInProcess(true);

      const response = await verifySentEmailSystemStatus(selectedDocumentsIds, true);

      setTimeout(() => {
        onEditCompleted(selectedDocumentsIds[0]);
        toggle();
        setSelected({});
        setClosingBookingsInProcess(false);
      }, 3000);
    } catch (err) {
      setIsCatchError(true);
      setClosingBookingsInProcess(false);
      console.log("err", err);
    }
  };

  return (
    <>
      <ModalHeader>
        Confirmation
      </ModalHeader>
      <ModalBody className="py-3">
        <p className="text-center">Are you sure to verified {selectedDocumentsIds?.length} selected documents?</p>
      </ModalBody>
      <ModalFooter>
        <Button
          className="float-right text-align-center ml-1"
          color="light"
          onClick={toggle}
        >
          Cancel
        </Button>
        <Button
          className="float-right text-align-center ml-1"
          color="primary"
          onClick={() => {
            updateClosedStatus();
            setIsCatchError(false);
          }}
          disabled={closingBookingsInProcess}
        >
          { closingBookingsInProcess ? "Processing..." : "Confirm" }
        </Button>
      </ModalFooter>
      {isCatchError && (
        <Alert color='danger text-center'>
          <div className='alert-body'>
            Something went wrong, please try again.
          </div>
        </Alert>
      )}
    </>
  );
};

ConfirmSystemStatusToVerified.propTypes = {
  toggle: PropTypes.func.isRequired,
  selectedBookingsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onEditCompleted: PropTypes.func.isRequired,
  setSelected: PropTypes.func.isRequired
};

export default ConfirmSystemStatusToVerified;
