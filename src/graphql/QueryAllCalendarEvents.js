import {gql} from "@apollo/client";

export default gql`
query GetCalendarEvents($filter:CalendarEventQueryInput!) {
  calendarEvents(limit: 10000, query: $filter) {
      _id
      classId
      bookingId
      status
      toHour
      toMinutes
      year
      day
      fromHour
      fromMinutes
      month
      rushFee
      rescheduleRequest {
        year
        month
        day
        fromHour
        fromMinutes
        toHour
        toMinutes
        rushFee
        requestedAt
      }
  }
}`;
