import { CREDIT_CARD_FEE, DEPOSIT, RUSH_FEE, SALES_TAX, SERVICE_FEE } from './Constants'
import { isAnon, userData } from './RealmApolloClient'

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const capitalizeString = (str) => {
  if (!str) return
  const strComponents = str.toLowerCase().split(' ')
  strComponents.forEach((element, index) => {
    if (element && element[0] && element[0].length > 0) strComponents[index] = element.replace(element[0], element[0].toUpperCase())
  })
  return strComponents.join(' ')
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => !isAnon()
export const getUserData = () => userData()

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

export const toAmPm = (hour, minutes, timeZoneLabel) => {
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const hours = `${hour >= 12 ? ((hour + 11) % 12) + 1 : hour}:${minutes === 0 ? '00' : minutes} ${suffix} ${timeZoneLabel}`

  return hours
}

export const isValidEmail = (email) => {
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return !email || reg.test(String(email).toLowerCase())
}

export const isPhoneValid = (phone) => {
  const reg = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
  return !phone || reg.test(phone)
}

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

//get totals associated to a booking
export const getBookingTotals = (bookingInfo, isRushDate, salesTax = SALES_TAX, isCardFeeIncluded = false) => {
  const minimum = bookingInfo.classVariant ? bookingInfo.classVariant.minimum : bookingInfo.classMinimum

  //pricePerson is currently in use for group based pricing too
  const price = bookingInfo.classVariant ? bookingInfo.classVariant.pricePerson : bookingInfo.pricePerson

  const discount = bookingInfo.discount
  let totalTaxableAdditionalItems = 0
  let totalNoTaxableAdditionalItems = 0
  let customDeposit,
    customAttendees = undefined

  if (bookingInfo.invoiceDetails && bookingInfo.invoiceDetails.length >= 2) {
    customDeposit = bookingInfo.invoiceDetails[0].unitPrice
    customAttendees = bookingInfo.invoiceDetails[1].units

    const items = bookingInfo.invoiceDetails.slice(2)

    totalTaxableAdditionalItems = items
      .filter((element) => element.taxable === true)
      .reduce((previous, current) => {
        const currentTotal = current.unitPrice * current.units
        return previous + currentTotal
      }, 0)

    totalNoTaxableAdditionalItems = items
      .filter((element) => element.taxable === false)
      .reduce((previous, current) => {
        const currentTotal = current.unitPrice * current.units
        return previous + currentTotal
      }, 0)
  }

  const attendees = customAttendees || bookingInfo.attendees

  const addons = bookingInfo.addons
    ? bookingInfo.addons.reduce((previous, current) => {
        return previous + (current.unit === 'Attendee' ? current.unitPrice * attendees : current.unitPrice)
      }, 0)
    : 0

  const withoutFee =
    bookingInfo.classVariant && bookingInfo.classVariant.groupEvent ? price : attendees > minimum ? price * attendees : price * minimum

  const underGroupFee = attendees > minimum || (bookingInfo.classVariant && bookingInfo.classVariant.groupEvent) ? 0 : price * (minimum - attendees)

  let cardFee = 0
  const rushFee = isRushDate ? withoutFee * RUSH_FEE : 0

  const totalDiscount = discount > 0 ? (withoutFee + totalTaxableAdditionalItems + addons + totalNoTaxableAdditionalItems) * discount : 0
  const fee = (withoutFee + totalTaxableAdditionalItems + addons + totalNoTaxableAdditionalItems - totalDiscount) * SERVICE_FEE
  const totalDiscountTaxableItems = discount > 0 ? (withoutFee + totalTaxableAdditionalItems + addons) * discount : 0
  const tax = (withoutFee + fee + rushFee + addons + totalTaxableAdditionalItems - totalDiscountTaxableItems) * salesTax
  let finalValue = withoutFee + totalTaxableAdditionalItems + totalNoTaxableAdditionalItems + addons + fee + rushFee + tax - totalDiscount

  if (isCardFeeIncluded) {
    cardFee = finalValue * CREDIT_CARD_FEE
    finalValue = finalValue + cardFee
  }

  const initialDeposit = finalValue * DEPOSIT

  return {
    withoutFee,
    underGroupFee,
    rushFee,
    fee,
    tax,
    addons,
    finalValue,
    initialDeposit,
    customDeposit,
    customAttendees,
    totalTaxableAdditionalItems,
    totalNoTaxableAdditionalItems,
    cardFee,
    discount,
    totalDiscount
  }
}

//gets the absoluteUrl of the site
export const absoluteUrl = (req, setLocalhost) => {
  let protocol = 'https:'
  let host = req ? req.headers['x-forwarded-host'] || req.headers['host'] : window.location.host

  if (host.indexOf('localhost') > -1) {
    if (setLocalhost) host = setLocalhost
    protocol = 'http:'
  }

  return {
    protocol: protocol,
    host: host,
    origin: protocol + '//' + host
  }
}
