// @packages
import React from 'react';

const RenderList = ({
  convo,
  muted
}) => {
  return (
    <div style={{
      display: "grid"
    }}>
      <span 
        style={{ 
          verticalAlign: "top", 
          paddingLeft: muted ? 4 : 0,
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
          paddingLeft: muted ? 4 : 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <span style={{ fontWeight: "bold"}}>Customer:</span> {convo && convo?.customer?.name}
      </span>
      <span 
        style={{ 
          verticalAlign: "top",
          paddingLeft: muted ? 4 : 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        <span style={{ fontWeight: "bold"}}>Class:</span> {convo && convo?.classTitle}
      </span>
      {convo?.calendarEvent?.year && convo?.calendarEvent?.month && convo?.calendarEvent?.day && (
        <span 
          style={{ 
            verticalAlign: "top",
            paddingLeft: muted ? 4 : 0,
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