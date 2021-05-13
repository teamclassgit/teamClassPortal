import {gql} from "@apollo/client"

export default gql`
query ListCalendarEvents($bookingId:ID!) {
  listCalendarEvents(filter: {bookingId: {eq: $bookingId}}, limit: 100) {
    items {
      id
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
    }
  }
}`
