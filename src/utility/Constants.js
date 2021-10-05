export const BOOKING_STATUS = [
  { label: 'Quote', value: 'quote', color: 'light-danger' },
  { label: 'Date/Time requested', value: 'date-requested', color: 'light-danger' },
  { label: 'Date/Time accepted', value: 'accepted', color: 'light-warning' },
  { label: 'Date/Time rejected', value: 'rejected', color: 'light-warning' },
  { label: 'Deposit paid', value: 'confirmed', color: 'light-success' },
  { label: 'Headcount', value: 'headcount', color: 'light-danger' },
  { label: 'Kit Full-fitment', value: 'kit-full-fitment', color: 'light-danger' },
  { label: 'Paid (Full)', value: 'paid', color: 'light-danger' },
  { label: 'Reviews', value: 'reviews', color: 'light-danger' },
  { label: 'Canceled', value: 'canceled', color: 'light-danger' }
]

//scheduling
export const DEFAULT_AVAILABILITY = [
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 1,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 2,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 3,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 4,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 5,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 6,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  },
  {
    increment: 30,
    toMinutes: 0,
    dayOfWeek: 7,
    fromHour: 7,
    fromMinutes: 0,
    toHour: 21
  }
]
export const DEFAULT_AVAILABILITY_ALWAYS = true
export const MAX_DATE_OPTIONS = 1
export const BREAK_BETWEEN_CLASSES_HOURS = 0.5
export const DAYS_AFTER_CURRENT_DATE_NOT_AVAILABLE_TO_SCHEDULE = 5
export const DAYS_AFTER_CURRENT_DATE_CONSIDERED_RUSH_DATE = 15

//Fees
export const RUSH_FEE = 0.15
export const SERVICE_FEE = 0.1
export const SALES_TAX = 0.0825
