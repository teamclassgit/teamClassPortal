export const BOOKING_STATUS = [
  { label: 'Quote', value: 'quote', color: 'light-danger' },
  { label: 'Date/Time requested', value: 'date-requested', color: 'light-danger' },
  { label: 'Date/Time rejected', value: 'rejected', color: 'light-warning' },
  { label: 'Date/Time accepted', value: 'accepted', color: 'light-warning' },
  { label: 'Deposit paid', value: 'confirmed', color: 'light-success' },
  //{ label: 'Headcount', value: 'headcount', color: 'light-danger' },
  //{ label: 'Kit Full-fitment', value: 'kit-full-fitment', color: 'light-danger' },
  { label: 'Paid (Full)', value: 'paid', color: 'light-danger' },
  { label: 'Reviews', value: 'reviews', color: 'light-danger' }
  //{ label: 'Canceled', value: 'canceled', color: 'light-danger' }
]

//scheduling
export const DEFAULT_AVAILABILITY = [
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 1,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 2,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 3,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 4,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 5,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 6,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 7,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 23
  }
]

export const DEFAULT_AVAILABILITY_ALWAYS = true
export const MAX_DATE_OPTIONS = 1
export const BREAK_BETWEEN_CLASSES_HOURS = 0.5
export const DAYS_AFTER_CURRENT_DATE_NOT_AVAILABLE_TO_SCHEDULE = 5
export const DAYS_AFTER_CURRENT_DATE_CONSIDERED_RUSH_DATE = 15
export const DAYS_BEFORE_EVENT_REGISTRATION = 21

//Fees
export const RUSH_FEE = 0
export const SERVICE_FEE = 0.1
export const CREDIT_CARD_FEE = 0.03
export const SALES_TAX = 0.0825
export const SALES_TAX_STATE = 'Texas'
export const DEPOSIT = 0.25

//date and time, and booking statuses
export const DATE_AND_TIME_RESERVED_STATUS = 'reserved'
export const DATE_AND_TIME_REJECTED_STATUS = 'rejected'
export const DATE_AND_TIME_CONFIRMATION_STATUS = 'confirmed'
export const BOOKING_DEPOSIT_CONFIRMATION_STATUS = 'confirmed'
export const BOOKING_PAID_STATUS = 'paid'
export const BOOKING_DATE_REQUESTED_STATUS = 'date-requested'
export const BOOKING_QUOTE_STATUS = 'quote'
export const BOOKING_CLOSED_STATUS = 'closed'

export const DEFAULT_TIME_ZONE = 'America/Chicago'
export const DEFAULT_TIME_ZONE_LABEL = 'CT'
export const DEFAULT_TIME_ZONE_LABEL_DESCRIPTION = 'Central Time'

// deposit
export const CHARGE_URL = 'outside-of-system'
export const PAYMENT_STATUS_SUCCESS = 'succeeded'
export const PAYMEN_STATUS_CANCEL = 'canceled'
