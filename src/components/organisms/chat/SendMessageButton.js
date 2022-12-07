// @packages
import PropTypes from "prop-types";
import React from "react";
import { Button } from "reactstrap";

const SendMessageButton = ({ onClick }) => (
  <Button
    color="primary"
    onClick={onClick}
  >
    Send
  </Button>
);

SendMessageButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default SendMessageButton;
