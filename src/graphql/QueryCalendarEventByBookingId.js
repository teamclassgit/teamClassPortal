import {gql} from "@apollo/client"

export default gql`
query ListCalendarEvents($bookingId:String!) {
  calendarEvents(filter: {bookingId: $bookingId}, limit: 100) {
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
  }
}`
