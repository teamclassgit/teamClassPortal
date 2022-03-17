import moment from 'moment-timezone';

//get a full date and time moment object from a calendarEvent object
const getEventFullDate = (calendarEvent) => {
  if (!calendarEvent) return;

  const eventTime = `${calendarEvent.fromHour < 10 ? '0' : ''}${calendarEvent.fromHour}:${calendarEvent.fromMinutes < 10 ? '0' : ''}${
    calendarEvent.fromMinutes
  }`;

  const eventDate = moment.tz(
    `${calendarEvent.year}-${calendarEvent.month < 10 ? '0' : ''}${calendarEvent.month}-${calendarEvent.day < 10 ? '0' : ''}${
      calendarEvent.day
    } ${eventTime}`,
    calendarEvent.timezone
  );

  return eventDate;
};

export { getEventFullDate };
