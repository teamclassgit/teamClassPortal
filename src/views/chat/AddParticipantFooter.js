// @packages
import React from "react";
import { ArrowBackIcon } from "@twilio-paste/icons/esm/ArrowBackIcon";
import { Button, ModalFooter } from 'reactstrap';
import { ModalFooterActions } from "@twilio-paste/modal";

const AddParticipantFooter = (
  props
) => {
  console.log(props);
  return (
    <>
      <ModalFooter>
        <ModalFooterActions justify="start">
          <Button
            variant="secondary"
            onClick={() => {
              props.onBack();
            }}
          >
            <ArrowBackIcon
              decorative={true}
              title="Back to manage participants"
              size="sizeIcon10"
            />
            Back
          </Button>
        </ModalFooterActions>
        <ModalFooterActions>
          <Button
            disabled={props.isSaveDisabled ?? false}
            variant="primary"
            onClick={() => {
              props.action();
            }}
          >
            {props.actionName}
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </>
  );
};

export default AddParticipantFooter;
