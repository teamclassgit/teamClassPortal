import {gql} from "@apollo/client"

export default gql`
mutation requestPreferredTimeNew(
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
  $bookingStatus: String!,
  $isRushFee: Boolean!,
  $rushFee: Float!,
  $updatedAt: AWSDateTime!
) {
   createCalendarEvent(
     input: {
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
              rushFee:$isRushFee
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
      rushFee
  }
  updateBooking(
    input: {id: $bookingId, updatedAt: $updatedAt, status: $bookingStatus, rushFee:$rushFee}) {
     id
     status
     rushFee
  }
}`