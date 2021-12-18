// ** React Import
import React, { useState, useEffect } from 'react';

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Alert } from 'reactstrap';
import moment from 'moment';
import './calendar.scss';
import { BOOKING_DATE_REQUESTED_STATUS } from '../../utility/Constants';
import { getClassTitle, getFormattedEventDate, getCustomerName, getCustomerCompany, getCustomerPhone, getCustomerEmail } from '../booking/common';

const Calendar = ({ bookings, calendarEvents, classes, customers }) => {
  const [events, setEvents] = useState([]);
  const [filteredCalendarEvents, setFilteredCalendarEvents] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalClassTitle, setModalClassTitle] = useState(null);
  const [modalBookingInfo, setModalBookingInfo] = useState(null);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (calendarEvents) {
      const confirmedCalendarEvents = calendarEvents.filter((item) => item.status === 'confirmed');
      setFilteredCalendarEvents(confirmedCalendarEvents);
    }
  }, [calendarEvents]);

  useEffect(() => {
    if (bookings && filteredCalendarEvents && classes) {
      const eventsArray = [];
      bookings.map((item, index) => {
        const formatDate = getFormattedEventDate(item._id, filteredCalendarEvents);
        eventsArray.push({
          title: `${
            getCustomerCompany(item.customerId, customers) ? getCustomerCompany(item.customerId, customers).concat(' / ') : ''
          }${getCustomerName(item.customerId, customers)}`,
          classTitle: getClassTitle(item.teamClassId, classes),
          bookingId: item._id,
          attendees: item.attendees,
          customerName: getCustomerName(item.customerId, customers),
          customerCompany: getCustomerCompany(item.customerId, customers),
          customerPhone: getCustomerPhone(item.customerId, customers),
          customerEmail: getCustomerEmail(item.customerId, customers),
          classVariant:
            item.classVariant && `${item.classVariant.title} $${item.classVariant.pricePerson}${item.classVariant.groupEvent ? '/group' : '/person'}`,
          signUpDeadline: item.signUpDeadline,
          eventDate: getFormattedEventDate(item._id, filteredCalendarEvents),
          date: moment(getFormattedEventDate(item._id, filteredCalendarEvents), 'LL').format('YYYY-MM-DD HH:mm'),
          backgroundColor: item.status === BOOKING_DATE_REQUESTED_STATUS ? '#FF6563' : '#557FE7',
          status: item.status
        });
        setEvents(eventsArray);
      });
    }
  }, [bookings, filteredCalendarEvents, classes]);

  return (
    <>
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
        className="sidebar-sm"
        onClosed={(e) => handleClose()}
        onClick={(e) => e.preventDefault()}
      >
        <ModalHeader color="primary">
          <span className="font-weight-bolder">{modalClassTitle}</span>
        </ModalHeader>
        <ModalBody>
          <p>
            <strong>Name: </strong>
            {modalBookingInfo && modalBookingInfo.customerName}
          </p>
          {modalBookingInfo && modalBookingInfo.customerCompany && (
            <p>
              <strong>Company: </strong>
              {modalBookingInfo.customerCompany}
            </p>
          )}
          <p>
            <strong>Class: </strong>
            {modalBookingInfo && modalBookingInfo.classTitle}
          </p>
          <p>
            <strong>Event date: </strong>
            {modalBookingInfo && modalBookingInfo.eventDate}
          </p>
          <p>
            <strong>Class Variant: </strong>
            {modalBookingInfo && modalBookingInfo.classVariant}
          </p>
          <p>
            <strong>Attendees: </strong>
            {modalBookingInfo && modalBookingInfo.attendees}
          </p>
          {modalBookingInfo && modalBookingInfo.signUpDeadline && (
            <p>
              <strong>Sign Up Deadline: </strong>
              {moment(modalBookingInfo.signUpDeadline).format('lll')}
            </p>
          )}
          <Alert color="danger" isOpen={modalBookingInfo && modalBookingInfo.status === BOOKING_DATE_REQUESTED_STATUS ? true : false}>
            <span>Date and time was accepted but event is yet to be confirmed.</span>
          </Alert>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-center">
          <Button
            onClick={(e) => {
              e.preventDefault();
              setShowModal(!showModal);
            }}
            color="primary"
            size="sm"
            className="col-2 "
          >
            Ok
          </Button>{' '}
        </ModalFooter>
      </Modal>

      <div className="calendar font-weight-normal small ">
        <FullCalendar
          defaultView="dayGridMonth"
          dayMaxEvents={3}
          plugins={[dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          eventClick={(e) => {
            setShowModal(!showModal);
            setModalClassTitle(e.event._def.title);
            setModalBookingInfo(e.event._def.extendedProps);
          }}
          events={{ events }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
          }}
        />
      </div>
    </>
  );
};

export default Calendar;
