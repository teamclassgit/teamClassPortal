import moment from 'moment';
import { toAmPm } from '../../utility/Utils';
import { BOOKING_STATUS } from '../../utility/Constants';

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
