// @packages
import PropTypes from 'prop-types';
import React from "react";
import { ArrowLeft } from "react-feather";
import { Button, ModalFooter } from 'reactstrap';

const AddParticipantFooter = ({
  action,
  actionName,
  isSaveDisabled,
  onBack
}) => {
  return (
    <ModalFooter>
      <Button
        color="primary"
        onClick={onBack}
      >
        <ArrowLeft
          size={16}
          title="Back to manage participants"
        />
        Back
      </Button>
      <Button
        color="primary"
        disabled={isSaveDisabled ?? false}
        onClick={action}
      >
        {actionName}
      </Button>
    </ModalFooter>
  );
};

AddParticipantFooter.propTypes = {
  action: PropTypes.func.isRequired,
  actionName: PropTypes.string.isRequired,
  isSaveDisabled: PropTypes.bool,
  onBack: PropTypes.func.isRequired
};

export default AddParticipantFooter;
