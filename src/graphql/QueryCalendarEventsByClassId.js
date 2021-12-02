import {gql} from "@apollo/client";

export default gql`
query ListCalendarEvents($classId:String!) {
  calendarEvents(query: {classId: $classId}, limit: 1000) {
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
      isBlockedDate
  }
}`;
