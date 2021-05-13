import {gql} from "@apollo/client"

export default gql`
query ListCalendarEvents($classId:ID!) {
  listCalendarEvents(filter: {classId: {eq: $classId}}, limit: 1000) {
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
