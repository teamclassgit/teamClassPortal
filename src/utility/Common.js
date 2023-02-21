import moment from "moment";
import { toAmPm } from "./Utils";
import { BOOKING_STATUS, DAYS_BEFORE_EVENT_REGISTRATION, DEFAULT_TIME_ZONE_LABEL } from "./Constants";

export const getCustomerName = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].name : "";
};

export const getCustomerEmail = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].email : "";
};

export const getClassTitle = (teamClassId, classes) => {
  const result = classes.filter((element) => element._id === teamClassId);
  return result && result.length > 0 ? result[0].title : "";
};

export const getCustomerPhone = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].phone : "";
};

export const getCustomerCompany = (customerId, customers) => {
  const result = customers.filter((element) => element._id === customerId);
  return result && result.length > 0 ? result[0].company : "";
};

export const getFormattedEventDate = (bookingId, calendarEvents) => {
  const result = calendarEvents.filter((element) => element.bookingId === bookingId);
  if (result && result.length > 0) {
    const calendarEvent = result[0];
    const date = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day);
    const time = toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, "");
    return `${moment(date).format("LL")} ${time} ${DEFAULT_TIME_ZONE_LABEL}`;
  }
  return "";
};

export const getBookingColor = (rowStatus) => {
  const resBookingColor = BOOKING_STATUS.find((bng) => bng.value === rowStatus);
  return resBookingColor ? resBookingColor.color : "primary";
};

export const getBookingValue = (rowStatus) => {
  const resBookingValue = BOOKING_STATUS.find((bng) => bng.value === rowStatus);
  return resBookingValue;
};

export const getCoordinatorName = (coordinatorId, coordinators) => {
  if (!coordinatorId || !coordinators) return;
  const result = coordinators.find((element) => element._id === coordinatorId);
  return (result && result.name) || "";
};

export const getFinalPaymentPaid = (bookingInfo) => {
  const finalPaymentPaid =
    bookingInfo && bookingInfo.payments && bookingInfo.payments.find((element) => element.paymentName === "final" && element.status === "succeeded");

  const paidAmount = finalPaymentPaid ? finalPaymentPaid.amount / 100 : 0;
  return paidAmount.toFixed(2);
};

export const getDepositPaid = (bookingInfo) => {
  const depositsPaid =
    bookingInfo &&
    bookingInfo.payments &&
    bookingInfo.payments.filter((element) => element.paymentName === "deposit" && element.status === "succeeded");

  const initialDepositPaid =
    depositsPaid?.length > 0 ? depositsPaid.reduce((previous, current) => previous + current.amount - (current?.refund?.refundAmount || 0), 0) / 100 : 0; //amount is in cents

  return initialDepositPaid.toFixed(2);
};

export const getLastPaymentDate = (bookingInfo) => {
  const dates =
    bookingInfo &&
    bookingInfo.payments &&
    bookingInfo.payments.filter((element) => element.status === "succeeded").map((payment) => payment.createdAt);

  if (!dates || dates.length === 0) return;

  dates.sort();
  dates.reverse();
  return moment(dates[0]).format("MM-DD-YYYY");
};

export const getEventDates = (calendarEvent, signUpDeadline) => {
  const dateObject = calendarEvent ? new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day) : null;
  const timeObject = calendarEvent ? toAmPm(calendarEvent.fromHour, calendarEvent.fromMinutes, DEFAULT_TIME_ZONE_LABEL) : null;
  let finalSignUpDeadline = null;
  if (calendarEvent && signUpDeadline) {
    finalSignUpDeadline = `${moment(signUpDeadline).format("MM/DD/YYYY hh:mm A")} ${DEFAULT_TIME_ZONE_LABEL}`;
  } else if (!signUpDeadline) {
    finalSignUpDeadline = `${moment(dateObject).subtract(DAYS_BEFORE_EVENT_REGISTRATION, "days").format("MM/DD/YYYY")} ${timeObject}`;
  }

  const dates = {
    date: dateObject,
    time: timeObject,
    signUpDeadline: finalSignUpDeadline,
    rescheduleDateTime: undefined
  };

  if (calendarEvent && calendarEvent.rescheduleRequest) {
    const rescheduleTime = toAmPm(calendarEvent.rescheduleRequest.fromHour, calendarEvent.rescheduleRequest.fromMinutes, DEFAULT_TIME_ZONE_LABEL);
    const rescheduleDateTime = `${moment(
      new Date(calendarEvent.rescheduleRequest.year, calendarEvent.rescheduleRequest.month - 1, calendarEvent.rescheduleRequest.day)
    ).format("MM/DD/YYYY")} ${rescheduleTime}`;
    dates.rescheduleDateTime = rescheduleDateTime;
  }

  return dates;
};
