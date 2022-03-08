import React, { Fragment } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight } from 'react-feather';
import { Alert, Button, Col, Form, FormGroup, Row, Badge } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import { toAmPm } from '../../../utility/Utils';
import {
  DEFAULT_AVAILABILITY_ALWAYS,
  DEFAULT_AVAILABILITY,
  DAYS_AFTER_CURRENT_DATE_CONSIDERED_RUSH_DATE,
  BREAK_BETWEEN_CLASSES_HOURS,
  BOOKING_QUOTE_STATUS,
  DATE_AND_TIME_CONFIRMATION_STATUS,
  BOOKING_DATE_REQUESTED_STATUS,
  BOOKING_CLOSED_STATUS,
  RUSH_FEE,
  DEFAULT_TIME_ZONE,
  DEFAULT_TIME_ZONE_LABEL
} from '../../../utility/Constants';
import { useMutation } from '@apollo/client';
import mutationRequestPreferredTime from '../../../graphql/MutationRequestPreferredTime';
import { v4 as uuid } from 'uuid';

const DateTimeConfirmation = ({ stepper, type, classRushFee, availableEvents, calendarEvent, setCalendarEvent, booking, setBooking, teamClass }) => {
  const [date, setDate] = React.useState(null);
  const [time, setTime] = React.useState(null);
  const [availableTimes, setAvailableTimes] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);
  const [createOrUpdateCalendarEvent, { ...calendarEventData }] = useMutation(mutationRequestPreferredTime, {});

  const isDateTooEarly = () => {
    /*  const today = new Date()
          const reference = new Date()
          reference.setDate(today.getDate() + DAYS_AFTER_CURRENT_DATE_NOT_AVAILABLE_TO_SCHEDULE)//5 days
  
          return date && date.length > 0 && date[0] > today && date[0] <= reference */

    return false;
  };

  const isDateInThePast = () => {
    //This validation can be added if want to avoid dates in the past !date || date.length === 0 ? false : date[0] <= new Date()
    return false;
  };

  const isRushDate = () => {
    
    if (booking && booking.classVariant && !booking.classVariant.hasKit) return false;

    const today = new Date();
    const reference = new Date();
    reference.setDate(today.getDate() + DAYS_AFTER_CURRENT_DATE_CONSIDERED_RUSH_DATE); //15 days
    return !isDateTooEarly() && date && date.length > 0 && date[0] > today && date[0] <= reference;
  };

  React.useEffect(() => {
    //setDate([new Date(2021, 4, 10)])
    setDate(
      calendarEvent ? [new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day)] : [new Date().setDate(new Date().getDate() + 20)]
    );
    setTime(calendarEvent ? `${calendarEvent.fromHour}:${calendarEvent.fromMinutes === 0 ? '00' : calendarEvent.fromMinutes}` : null);
  }, [calendarEvent]);

  const hasEvents = (selectedDate, fullStartHour, fullEndHour, breakBetweenClasses) => {
    if (!availableEvents) return false;

    const day = selectedDate.date();
    const month = selectedDate.month() + 1;
    const year = selectedDate.year();

    const calendarEvents = availableEvents.filter((element) => {
      const eventFullStartHour = element.fromHour + element.fromMinutes / 60 - breakBetweenClasses;
      const eventFullEndHour = element.toHour + element.toMinutes / 60 + breakBetweenClasses;

      return (
        element.bookingId !== booking._id &&
        element.day === day &&
        element.month === month &&
        element.year === year &&
        ((fullStartHour >= eventFullStartHour && fullStartHour < eventFullEndHour) ||
          (fullEndHour >= eventFullStartHour && fullEndHour < eventFullEndHour))
      );
    });

    //a blocked slot configured by the instructor for this class
    const isBlockedSlot = calendarEvents && calendarEvents.find((element) => element.isBlockedDate === true) ? true : false;

    return {
      hasEvents: calendarEvents && calendarEvents.length > 0 ? true : false,
      isBlockedSlot
    };
  };

  const getAvailableTimes = (selectedDate) => {
    const times = [];

    if (selectedDate && teamClass) {
      const availabilities =
        teamClass.availability && teamClass.availability.length > 0 && !DEFAULT_AVAILABILITY_ALWAYS
          ? teamClass.availability.filter((element) => element.dayOfWeek === selectedDate.isoWeekday())
          : DEFAULT_AVAILABILITY.filter((element) => element.dayOfWeek === selectedDate.isoWeekday());

      for (let j = 0; j < availabilities.length; j++) {
        const availability = availabilities[j];
        const breakBetweenClasses = BREAK_BETWEEN_CLASSES_HOURS;
        const incrementInHours = availability.increment / 60;
        const fromHourAndMinutes = availability.fromHour + availability.fromMinutes / 60;
        const toHourAndMinutes = availability.toHour + availability.toMinutes / 60;
        for (let i = fromHourAndMinutes; i < toHourAndMinutes; i = i + incrementInHours) {
          const fullEndHour = i + teamClass.duration;
          const hasEventsInSlot = hasEvents(selectedDate, i, fullEndHour, breakBetweenClasses);
          const fullMinutes = i * 60;
          let eHour = Math.floor(fullMinutes / 60);
          eHour = eHour < 10 ? `${eHour}` : eHour;
          let eMinutes = fullMinutes % 60;
          eMinutes = eMinutes < 10 ? `0${eMinutes}` : eMinutes;

          times.push({
            hour: eHour,
            minutes: eMinutes,
            label: `${eHour}:${eMinutes}`,
            amPm: toAmPm(eHour, eMinutes, ''),
            open: !hasEventsInSlot.isBlockedSlot && (teamClass.multipleInstructors || !hasEventsInSlot.hasEvents)
          });
        }
      }
    }

    return times;
  };

  React.useEffect(() => {
    if (date) {
      setAvailableTimes(getAvailableTimes(moment(date[0])));
    }
  }, [date]);

  const saveCalendarEvent = async () => {
    setProcessing(true);

    const selectedDate = moment(date[0]);
    const eventDate = moment(`${selectedDate.format('DD/MM/YYYY')} ${time}`, 'DD/MM/YYYY HH:mm');
    const newFromHour = eventDate.hour();
    const newFromMinutes = eventDate.minutes();
    const eventEnd = eventDate.add(teamClass.duration, 'hours');
    const newToHour = eventEnd.hour();
    const newToMinutes = eventEnd.minutes();

    const sameEventDate =
      calendarEvent &&
      calendarEvent._id &&
      selectedDate.year() === calendarEvent.year &&
      selectedDate.month() + 1 === calendarEvent.month &&
      selectedDate.date() === calendarEvent.day &&
      newFromHour === calendarEvent.fromHour &&
      newFromMinutes === calendarEvent.fromMinutes;

    if (sameEventDate) {
      setProcessing(false);
      return;
    }

    try {
      const calendarEventData = {
        id: calendarEvent ? calendarEvent._id : uuid(),
        classId: teamClass._id,
        bookingId: booking._id,
        year: selectedDate.year(),
        month: selectedDate.month() + 1,
        day: selectedDate.date(),
        fromHour: newFromHour,
        fromMinutes: newFromMinutes,
        toHour: newToHour,
        toMinutes: newToMinutes,
        status: DATE_AND_TIME_CONFIRMATION_STATUS,
        isRushFee: isRushDate(),
        rushFee: classRushFee,
        timezone: calendarEvent ? calendarEvent.timezone : DEFAULT_TIME_ZONE,
        timezoneLabel: calendarEvent ? calendarEvent.timezoneLabel : DEFAULT_TIME_ZONE_LABEL,
        displayTimezone: calendarEvent?.displayTimezone ? calendarEvent.displayTimezone : null,
        displayTimezoneLabel: calendarEvent?.displayTimezoneLabel ? calendarEvent.displayTimezoneLabel : null,
        bookingStatus: booking.status === BOOKING_QUOTE_STATUS ? BOOKING_DATE_REQUESTED_STATUS : booking.status,
        updatedAt: new Date()
      };

      const result = await createOrUpdateCalendarEvent({
        variables: calendarEventData
      });

      if (result && result.data) {
        setCalendarEvent(result.data.upsertOneCalendarEvent);
        setBooking(result.data.updateOneBooking);
      }

      console.log('calendar event saved');

      setProcessing(false);
    } catch (ex) {
      console.log(ex);
      setProcessing(false);
    }
  };

  return (
    <Fragment>
      <Form onSubmit={(e) => e.preventDefault()}>
        <div className="content-header pb-1">
          <h4 className="mb-0">
            Select a date and time<small className="text-primary"> Tell us what's your preferred time. We'll get back to you within 24h.</small>
          </h4>
        </div>

        <Row>
          <Col md={12} lg={4} sm={12}>
            <FormGroup>
              <Flatpickr
                className="form-control hidden"
                value={date}
                options={{ inline: true }}
                onChange={(value) => {
                  setDate(value);
                  setTime(null);
                }}
              />
            </FormGroup>
          </Col>
          <Col md={12} lg={1} sm={12}></Col>
          <Col md={12} lg={6} sm={12} className="pb-2">
            <Row>
              {availableTimes &&
                availableTimes.map((element, index) => (
                  <Button.Ripple
                    key={`time${index}`}
                    className="btn-sm"
                    disabled={(isDateInThePast() || isDateTooEarly()) && !(time === element.label)}
                    color={element.open || (time === element.label) ? 'primary' : 'secondary'}
                    tag={Col}
                    lg={4}
                    md={6}
                    sm={12}
                    outline={!(time === element.label)}
                    onClick={(e) => setTime(element.label)}
                  >
                    {element.amPm}
                  </Button.Ripple>
                ))}
            </Row>
            {availableTimes && availableTimes.length > 0 && (
              <div className="pb-1 pt-1">
                <small className="text-default text-primary">
                  <Badge>CT: Central Time</Badge>
                </small>
              </div>
            )}
            <div>
              {date && date.length > 0 && (
                <Alert color="danger" isOpen={isRushDate()}>
                  <div className="alert-body">
                    <AlertCircle size={15} />
                    <span className="ml-1">Rush fee of ${RUSH_FEE} per attendee will be applied.</span>
                  </div>
                </Alert>
              )}
            </div>
          </Col>
          <Col md={12} lg={1} sm={12}></Col>
        </Row>

        <div className="d-flex justify-content-end">
          {booking && booking.status !== BOOKING_CLOSED_STATUS && (
            <Button.Ripple size="sm" color="primary" className="btn-next" onClick={() => saveCalendarEvent()} disabled={!time || !date || processing}>
              <span className="align-middle d-sm-inline-block d-none">{processing ? 'Processing...' : 'Save date'}</span>
            </Button.Ripple>
          )}
        </div>
      </Form>
    </Fragment>
  );
};

export default DateTimeConfirmation;
