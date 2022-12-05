// ** React Import
import React, { useState, useEffect } from "react";

// ** Full Calendar & it's Plugins
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { Button, Modal, ModalBody, ModalHeader, ModalFooter, Alert } from "reactstrap";
import moment from "moment-timezone";
import "./calendar.scss";
import { BOOKING_DATE_REQUESTED_STATUS } from "../../../utility/Constants";

const CalendarComponent = ({ bookings, classes }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalClassTitle, setModalClassTitle] = useState(null);
  const [modalBookingInfo, setModalBookingInfo] = useState(null);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (bookings && classes) {
      const eventsArray = bookings.map((item, index) => {
        return {
          title: `${item.customerCompany ? item.customerCompany.concat(" / ") : ""}${item.customerName}`,
          classTitle: item.className,
          bookingId: item._id,
          attendees: item.attendees,
          customerName: item.customerName,
          customerCompany: item.customerCompany,
          customerPhone: item.customerPhone,
          customerEmail: item.customerEmail,
          classVariant:
            item.classVariant && `${item.classVariant.title} $${item.classVariant.pricePerson}${item.classVariant.groupEvent ? "/group" : "/person"}`,
          signUpDeadline: item.signUpDeadline,
          eventDate: moment(item.eventDateTime)?.tz(item.timezone)?.format("LLL"),
          date: moment(item.eventDateTime)?.tz(item.timezone)?.format("YYYY-MM-DD HH:mm"),
          backgroundColor: item.status === BOOKING_DATE_REQUESTED_STATUS ? "#FF6563" : "#557FE7",
          status: item.status
        };
      });
      setEvents(eventsArray);
    }
  }, [bookings, classes]);

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
            <strong>Booking Id: </strong>
            {modalBookingInfo && modalBookingInfo.bookingId}
          </p>
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
              {moment(modalBookingInfo.signUpDeadline).format("lll")}
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
          </Button>{" "}
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
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
          }}
        />
      </div>
    </>
  );
};

export default CalendarComponent;
