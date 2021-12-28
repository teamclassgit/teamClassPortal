// @packages
import React from "react";
import { ArrowLeft } from "react-feather";
import { Button, ModalFooter } from 'reactstrap';
import { ModalFooterActions } from "@twilio-paste/modal";

const AddParticipantFooter = (
  props
) => {
  return (
    <>
      <ModalFooter>
        <ModalFooterActions justify="start">
          <Button
            color="primary"
            onClick={() => {
              props.onBack();
            }}
          >
            <ArrowLeft
              size={16}
              decorative={true}
              title="Back to manage participants"
            />
            Back
          </Button>
        </ModalFooterActions>
        <ModalFooterActions>
          <Button
            disabled={props.isSaveDisabled ?? false}
            color="primary"
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
