import { gql } from '@apollo/client';

export default gql`
  mutation updateCalendarEventStatus($calendarEventId: String!, $status: String!) {
    updateOneCalendarEvent(query: { _id: $calendarEventId }, set: { status: $status }) {
      _id
      classId
      fromHour
      bookingId
      toHour
      month
      fromMinutes
      status
      year
      day
      toMinutes
      rushFee
    }
  }
`;
