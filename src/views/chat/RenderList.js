// @packages
import Proptypes from 'prop-types';
import React, { useState } from 'react';
import { ListGroupItem, Tooltip } from 'reactstrap';
import { getEventFullDate } from '../../services/CalendarEventService';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';

// @styles
import './RenderList.scss';

const RenderList = ({ booking, setSelectedBooking, isActive }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const dispatch = useDispatch();

  return (
    <ListGroupItem
      tag="a"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setSelectedBooking(booking?._id);
      }}
      active={isActive}
    >
      <small>
        <span>{booking?._id}</span>
        <br></br>
        <span id={`Tooltip-${booking?._id}`} className={!isActive ? "text-secondary" : ""}>
          <Tooltip isOpen={tooltipOpen} placement="right" target={`Tooltip-${booking?._id}`} toggle={toggle} delay={{ show: 50, hide: 50 }}>
            {booking?.classTitle}
          </Tooltip>
          <span style={{ fontWeight: 'normal' }}>{booking?.classTitle}</span>
        </span>
        {booking?.calendarEvent?.status && (
          <span className={!isActive ? "text-secondary" : ""}>
            <br></br>
            <span>{getEventFullDate(booking.calendarEvent).format('LLL')}</span>
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
