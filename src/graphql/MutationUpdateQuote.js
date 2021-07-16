import {gql} from "@apollo/client"

export default gql`
mutation updateQuote(
  $bookingId:String!,
  $customerId: String!,
  $calendarEventId: String, 
  $name: String!,
  $phone: String!,
  $email: String!,
  $company: String,
  $updatedAt: DateTime!,
  $status: String! 
) {
   updateOneCustomer(query: { _id: $customerId }, set: { name: $name, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }) {
          _id
          name
          email
          phone
          company
          createdAt
          updatedAt
   }
   updateOneCalendarEvent(query: { _id: $calendarEventId }, set: {status:$status}) {
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
   updateOneBooking(
    query: {_id: $bookingId},
    set: {
        customerName:$name,
        updatedAt: $updatedAt,
        status: $status        
        }) {
     _id
     date
     expirationHours
     teamClassId
     instructorId
     instructorName
     customerId
     customerName 
     eventDate 
     eventDurationHours
     attendees
     classMinimum
     pricePerson
     serviceFee
     salesTax
     discount
     status
     rushFee
     createdAt 
     updatedAt
  }
}`