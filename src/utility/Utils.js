// @packages
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { Storage } from 'aws-amplify';

// @scripts
import { CREDIT_CARD_FEE, DEPOSIT, RUSH_FEE, SALES_TAX, SERVICE_FEE } from './Constants';
import { isAnon, userData } from './RealmApolloClient';

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num);

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '');

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

export const capitalizeString = (str) => {
  if (!str) return;
  const strComponents = str.toLowerCase().split(' ');
  strComponents.forEach((element, index) => {
    if (element && element[0] && element[0].length > 0) strComponents[index] = element.replace(element[0], element[0].toUpperCase());
  });
  return strComponents.join(' ');
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value;
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: 'short', day: 'numeric' };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' };
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => !isAnon();
export const getUserData = () => userData();

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/';
  if (userRole === 'client') return '/access-control';
  return '/login';
};

export const toAmPm = (hour, minutes, timeZoneLabel) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hours = `${hour >= 12 ? ((hour + 11) % 12) + 1 : hour}:${minutes === 0 ? '00' : minutes} ${suffix} ${timeZoneLabel}`;

  return hours;
};

export const isValidEmail = (email) => {
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !email || reg.test(String(email).toLowerCase());
};

export const isPhoneValid = (phone) => {
  const reg = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
  return !phone || reg.test(phone);
};

export const isUrlValid = (url) => {
  const reg = /https?:\/\/.+/;
  return !url || reg.test(url);
};

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
});

//gets the absoluteUrl of the site
export const absoluteUrl = (req, setLocalhost) => {
  let protocol = 'https:';
  let host = req ? req.headers['x-forwarded-host'] || req.headers['host'] : window.location.host;

  if (host.indexOf('localhost') > -1) {
    if (setLocalhost) host = setLocalhost;
    protocol = 'http:';
  }

  return {
    protocol,
    host,
    origin: `${protocol}//${host}`
  };
};

export const getEventFullDate = (calendarEvent) => {
  if (!calendarEvent) return;

  const eventDate = new Date(calendarEvent.year, calendarEvent.month - 1, calendarEvent.day);
  const eventTime = `${calendarEvent.fromHour}:${calendarEvent.fromMinutes === 0 ? '00' : calendarEvent.fromMinutes}`;

  return moment(`${moment(eventDate).format('DD/MM/YYYY')} ${eventTime}`, 'DD/MM/YYYY HH:mm');
};

export const getQueryFiltersFromFilterArray = (filterValue) => {
  if (!filterValue) filterValue = [];

  const filters = filterValue
    .filter(
      (item) => (item.operator !== 'inrange' && item.operator !== 'notinrange' && item.value && item.value !== '') ||
        ((item.operator === 'inrange' || item.operator === 'notinrange') &&
          item.value?.start &&
          item.value?.start !== '' &&
          item.value?.end &&
          item.value?.end !== '')
    )
    .map(({ name, type, operator, value }) => {
      if (type === 'number' && (operator === 'inrange' || operator === 'notinrange')) return { name, type, operator, valueRangeNum: value };
      if (type === 'date' && (operator === 'inrange' || operator === 'notinrange')) return { name, type, operator, valueRange: value };
      if (type === 'select' && (operator === 'inlist' || operator === 'notinlist')) return { name, type, operator, valueList: value };
      if (type === 'number') return { name, type, operator, valueNum: value };
      return { name, type, operator, value };
    });

  return filters;
};

//Files
export const uploadFile = async (file) => {
  const { type: mimeType } = file;
  const key = `images/${uuid()}${file.name}`;
  const url = `${process.env.REACT_APP_PUBLIC_S3_BASEURL}/${key}`;
  console.log('url', url);
  const result = { url: '', error: '' };
  try {
    await Storage.put(key, file, {
      contentType: mimeType
    });
    result.url = url;
  } catch (err) {
    result.error = err;
  }

  return result;
};
