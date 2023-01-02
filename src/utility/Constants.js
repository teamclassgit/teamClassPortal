const total = 53;
export const BOOKING_STATUS = [
  { label: "Quote", value: "quote", color: "light-danger", board: true },
  { label: "Date/Time requested", value: "date-requested", color: "light-danger", board: true },
  { label: "Date/Time rejected", value: "rejected", color: "light-warning", board: false },
  { label: "Date/Time accepted", value: "accepted", color: "light-warning", board: true },
  { label: "Deposit paid", value: "confirmed", color: "light-success", board: true },
  { label: "Paid (Full)", value: "paid", color: "light-danger", board: true },
  { label: "Reviews", value: "reviews", color: "light-danger", board: false }
];

//scheduling
export const DEFAULT_AVAILABILITY = [
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 1,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 2,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 3,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 4,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 5,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 6,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 15,
    toMinutes: 0,
    dayOfWeek: 7,
    fromHour: 5,
    fromMinutes: 0,
    toHour: 23
  }
];

export const DEFAULT_AVAILABILITY_ALWAYS = true;
export const MAX_DATE_OPTIONS = 1;
export const BREAK_BETWEEN_CLASSES_HOURS = 0.5;
export const DAYS_AFTER_CURRENT_DATE_NOT_AVAILABLE_TO_SCHEDULE = 5;
export const DAYS_AFTER_CURRENT_DATE_CONSIDERED_RUSH_DATE = 15;
export const DAYS_BEFORE_EVENT_REGISTRATION = 14;

//Fees
export const RUSH_FEE = 35;
export const SERVICE_FEE = 0;
export const EXPECTED_MARGIN = 0.43; //43% of the price
export const CREDIT_CARD_FEE = 0.03;
export const SALES_TAX = 0.0825;
export const SALES_TAX_STATE = "Texas";
export const DEPOSIT = 0.25;

//date and time, and booking statuses
export const DATE_AND_TIME_RESERVED_STATUS = "reserved";
export const DATE_AND_TIME_REJECTED_STATUS = "rejected";
export const DATE_AND_TIME_CONFIRMATION_STATUS = "confirmed";
export const DATE_AND_TIME_CANCELED_STATUS = "canceled";
export const BOOKING_DEPOSIT_CONFIRMATION_STATUS = "confirmed";
export const BOOKING_PAID_STATUS = "paid";
export const BOOKING_DATE_REQUESTED_STATUS = "date-requested";
export const BOOKING_QUOTE_STATUS = "quote";
export const BOOKING_CLOSED_STATUS = "closed";

export const DEFAULT_TIME_ZONE = "America/Chicago";
export const DEFAULT_TIME_ZONE_LABEL = "CT";
export const DEFAULT_TIME_ZONE_LABEL_DESCRIPTION = "Central Time";

// deposit
export const CHARGE_OUTSIDE_SYSTEM = "outside-of-system";
export const PAYMENT_STATUS_SUCCEEDED = "succeeded";
export const PAYMENT_STATUS_CANCELED = "canceled";

export const BOOKING_LINKS = {
  selectDateAndTime: "customers/select-date-time/:bookingId",
  dateTimeConfirmation: "booking/date-time-confirmation/:bookingId",
  deposit: "customers/events/:bookingId?type=payment",
  finalPayment: "customers/events/:bookingId?type=payment",
  signUp: "event/:bookingId",
  signUpStatus: "customers/events/:bookingId?type=registration"
};
