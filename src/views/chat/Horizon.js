// @packages
import { Text } from "@twilio-paste/core";
import React from "react";

const Horizon = React.forwardRef(
  ({ amount }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          textAlign: "center",
          backgroundColor: 'blue',
          padding: 2,
          fontSize: "14px",
          lineHeight: "20px",
          margin: "16px 0"
        }}
      >
        <Text as="span" color="colorTextLink">
          {amount} new {amount > 1 ? "messages" : "message"}
        </Text>
      </div>
    );
  }
);

export default Horizon;
