import {gql} from "@apollo/client"

export default gql`
mutation updateCalendarEvent(
  $id:ID!,
  $classId: ID!, 
  $bookingId: ID!,
  $year: Int!, 
  $month: Int!, 
  $day: Int!,
  $fromHour: Int!,
  $fromMinutes: Int!,
  $toHour: Int!,
  $toMinutes: Int!,
  $status: String!,
) {
   updateCalendarEvent(
     input: {
              id:$id,
              classId:$classId,
              bookingId:$bookingId,
              year:$year, 
              month:$month 
              day:$day
              fromHour:$fromHour
              fromMinutes:$fromMinutes
              toHour:$toHour
              toMinutes:$toMinutes
              status:$status
          }) {
      id
      classId
      bookingId
      year 
      month 
      day
      fromHour
      fromMinutes
      toHour
      toMinutes
      status
  }
}`