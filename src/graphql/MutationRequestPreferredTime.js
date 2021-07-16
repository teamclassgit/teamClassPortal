import {gql} from "@apollo/client"

export default gql`
mutation requestPreferredTime(
  $id: String!,
  $classId: String!, 
  $bookingId: String!,
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
  $updatedAt: DateTime!
) {
   upsertOneCalendarEvent(
     query: {_id:$id},
     data: {
              _id: $id,
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
      _id
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
  updateOneBooking(query: {_id: $bookingId}, set: {updatedAt: $updatedAt, status: $bookingStatus, rushFee:$rushFee}) {
     _id
     status
     rushFee
  }
}`