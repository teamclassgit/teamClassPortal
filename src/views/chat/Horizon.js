// @packages
import React, { forwardRef } from "react";

// @styles
import "./Horizon.scss";

const Horizon = forwardRef(
  ({ amount }, ref) => {
    return (
      <div
        className="horizon"
        ref={ref}
      >
        <span>
          {amount} new {amount > 1 ? "messages" : "message"}
        </span>
      </div>
    );
  }
);

export default Horizon;
