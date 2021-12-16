import { Button } from "@twilio-paste/button";
import { Box } from "@twilio-paste/core";
import styles from "./chatStyles/chatStyles.module.scss";

const SendMessageButton = (
  props
) => {
  return (
    <Box>
      <Button
        variant="primary"
        onClick={() => {
          props.onClick();
        }}
      >
        Send
      </Button>
    </Box>
  );
};

export default SendMessageButton;
