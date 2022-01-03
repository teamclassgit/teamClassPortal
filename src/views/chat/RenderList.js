// @packages
import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

const RenderList = ({
  convo
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div style={{
      display: "grid"
    }}>
      <span 
        style={{ 
          verticalAlign: "top", 
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <span style={{ fontWeight: "bold"}}>Booking:</span> {convo && convo?._id ? convo?._id : convo?.friendlyName }
      </span>
      <span 
        style={{
          verticalAlign: "top",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <span style={{ fontWeight: "bold"}}>Customer:</span> {convo && convo?.customer?.name}
      </span>
      <span 
        id="TooltipExample"
        style={{ 
          verticalAlign: "top",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <span style={{ fontWeight: "bold"}} >Class: <span style={{ fontWeight: "normal"}} >{convo && convo?.classTitle}</span></span>
        <Tooltip 
          placement="right" 
          isOpen={tooltipOpen} 
          target="TooltipExample" 
          toggle={toggle}
        >
          {convo?.classTitle}
        </Tooltip>
      </span>
      {convo?.calendarEvent?.year && convo?.calendarEvent?.month && convo?.calendarEvent?.day && (
        <span 
          style={{ 
            verticalAlign: "top",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
          <span style={{ fontWeight: "bold"}}>Event Date:</span> {`${convo && convo?.calendarEvent?.year} / ${convo && convo?.calendarEvent?.month} / ${convo && convo?.calendarEvent?.day}`}
        </span>
      )}
    </div>
  );
};  

export default RenderList;