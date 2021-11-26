import moment from 'moment';
import { toAmPm } from '../../utility/Utils';
import { BOOKING_STATUS, DAYS_BEFORE_EVENT_REGISTRATION, DEFAULT_TIME_ZONE_LABEL } from '../../utility/Constants';

export const getCustomerName = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].name : '';
};

export const getCustomerEmail = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].email : '';
};

export const getClassTitle = (teamClassId, classes) => {
  const result = classes.filter((element) => element._id === teamClassId);
  return result && result.length > 0 ? result[0].title : '';
};

export const getCustomerPhone = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].phone : '';
};

export const getCustomerCompany = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].company : '';
};

export const getFormattedEventDate = (bookingId, calendarEvents) => {
  const result = calendarEvents.filter((element) => element.bookingId === bookingId);
  if (result && result.length > 0) {
    const calendarEvent = result[0];
    const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day);
    const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, '');
    return `${moment(date).format('LL')} ${time}`;
  }
  return '';
};

export const getBookingColor = (rowStatus) => {
  const resBookingColor = BOOKING_STATUS.find((bng) => bng.value === rowStatus);
  return resBookingColor ? resBookingColor.color : 'primary';
};

export const getBookingValue = (rowStatus) => {
  const resBookingValue = BOOKING_STATUS.find((bng) => bng.value === rowStatus);
  return resBookingValue;
};

export const getCoordinatorName = (coordinatorId, coordinators) => {
  const result = coordinators.find((element) => element._id === coordinatorId);
  return (result && result.name) || '';
};

export const getEventDates = (calendarEvent, signUpDeadline) => {
  const dateObject = calendarEvent ? new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day) : null;
  const timeObject = calendarEvent ? toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, DEFAULT_TIME_ZONE_LABEL) : null;
  let finalSignUpDeadline = null;
  if (calendarEvent && signUpDeadline) {
    finalSignUpDeadline = `${moment(signUpDeadline).format('MM/DD/YYYY kk:mm A')} ${DEFAULT_TIME_ZONE_LABEL}`;
  } else if (!signUpDeadline) {
    finalSignUpDeadline = `${moment(dateObject).subtract(DAYS_BEFORE_EVENT_REGISTRATION, 'days').format('MM/DD/YYYY')} ${timeObject}`;
  }

  return {
    date: dateObject,
    time: timeObject,
    signUpDeadline: finalSignUpDeadline
  };
};
