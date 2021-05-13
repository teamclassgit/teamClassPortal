import {gql} from "@apollo/client"

export default gql`
query GetCalendarEvents($filter:TableCalendarEventFilterInput!) {
  listCalendarEvents(limit: 1000,filter: $filter) {
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
