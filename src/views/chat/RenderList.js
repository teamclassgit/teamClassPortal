// @packages
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

// @styles
import './RenderList.scss';

const RenderList = ({
  convo,
  convoId
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div className='render-list-container'>
      <span className='render-list'>
        <span className='render-list-span'>Booking:</span> {convo && convo?._id ? convo?._id : convo?.friendlyName}
      </span>
      <span className='render-list'>
        <span className='render-list-span'>Customer:</span> {convo && convo?.customer?.name}
      </span>
      <span className='render-list' id={`Tooltip-${convoId}`}>
        <Tooltip 
          isOpen={tooltipOpen} 
          placement="right" 
          target={`Tooltip-${convoId}`}
          toggle={toggle}
          delay={{ show: 50, hide: 50 }}
        >
          {convo && convo?.classTitle}
        </Tooltip>
        <span className='render-list-span' >Class: <span style={{ fontWeight: "normal"}} >{convo && convo?.classTitle}</span></span>
      </span>
      {convo?.calendarEvent?.year && convo?.calendarEvent?.month && convo?.calendarEvent?.day && (
        <span>
          <span className='render-list-span'>Event Date:</span> {`${convo && convo?.calendarEvent?.year} / ${convo && convo?.calendarEvent?.month} / ${convo && convo?.calendarEvent?.day}`}
        </span>
      )}
    </div>
  );
};  

RenderList.propTypes = {
  convo: Proptypes.object.isRequired,
  convoId: Proptypes.string.isRequired
};

export default RenderList;