// @packages
import React from "react";
import { ArrowLeft } from "react-feather";
import { Button, ModalFooter } from 'reactstrap';
import { ModalFooterActions } from "@twilio-paste/modal";

const AddParticipantFooter = ({
  actionName,
  isSaveDisabled,
  onBack,
  action
}) => {
  return (
    <>
      <ModalFooter>
        <ModalFooterActions justify="start">
          <Button
            color="primary"
            onClick={() => { onBack(); }}
          >
            <ArrowLeft
              size={16}
              title="Back to manage participants"
            />
            Back
          </Button>
        </ModalFooterActions>
        <ModalFooterActions>
          <Button
            disabled={isSaveDisabled ?? false}
            color="primary"
            onClick={() => { action(); }}
          >
            {actionName}
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </>
  );
};

export default AddParticipantFooter;
