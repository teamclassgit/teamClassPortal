// @packages
import Proptypes from "prop-types";
import React, { useState } from "react";
import { ListGroupItem, Tooltip } from "reactstrap";
import moment from "moment-timezone";

// @styles
import "./RenderList.scss";
import { DEFAULT_TIME_ZONE_LABEL } from "../../utility/Constants";

const RenderList = ({ booking, setSelectedBooking, isActive }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <ListGroupItem
      tag="a"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setSelectedBooking(booking?._id);
      }}
      className={`list-group-item${isActive ? "-active" : ""}`}
      active={isActive}
    >
      <small>
        <span className="render-list-overflow">{`Booking Id: ${booking?._id}`}</span>
        <br></br>
        <span id={`Tooltip-${booking?._id}`} className={!isActive ? "text-secondary" : ""}>
          <Tooltip isOpen={tooltipOpen} placement="right" target={`Tooltip-${booking?._id}`} toggle={toggle} delay={{ show: 50, hide: 50 }}>
            {booking?.classTitle}
          </Tooltip>
          <span style={{ fontWeight: "normal" }}>{`ClassName: ${booking?.classTitle}`}</span>
        </span>
        {booking?.eventDateTime && (
          <span className={!isActive ? "text-secondary" : ""}>
            <br></br>
            <span>{`EventDate: ${moment(booking?.eventDateTime)?.tz(booking?.timezone)?.format("MM/DD/YYYY hh:mm A")} ${
              booking?.timezoneLabel || DEFAULT_TIME_ZONE_LABEL
            }`}</span>
          </span>
        )}
      </small>
    </ListGroupItem>
  );
};

RenderList.propTypes = {
  booking: Proptypes.object.isRequired
};

export default RenderList;
