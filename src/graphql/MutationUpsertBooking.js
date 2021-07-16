import {gql} from "@apollo/client"

export default gql`
mutation upsertBooking(
  $bookingId: String!,
  $date: DateTime!, 
  $teamClassId: String!, 
  $classVariant: BookingClassVariantInsertInput!,
  $instructorId: String,
  $instructorName: String, 
  $customerId: String!, 
  $customerName: String!, 
  $eventDate: DateTime!, 
  $eventDurationHours: Float!, 
  $attendees: Int!, 
  $classMinimum: Int!,
  $pricePerson: Float!, 
  $salesTax: Float!,
  $serviceFee: Float!, 
  $discount: Float!, 
  $createdAt: DateTime!, 
  $updatedAt: DateTime!,
  $status: String!
  $phone: String!, 
  $email: String,
  $company: String,
) {
   upsertOneCustomer(query: { _id: $customerId }, data: { _id: $customerId, name: $customerName, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }) {
          _id
          name
          email
          phone
          company
          createdAt
          updatedAt
        }
   upsertOneBooking(
    query: {_id:$bookingId},
    data: {
        _id:$bookingId, date: $date, expirationHours: 48, classVariant: $classVariant,
        teamClassId: $teamClassId, instructorId: $instructorId, instructorName: $instructorName
        customerId: $customerId, customerName:$customerName, eventDate: $eventDate, 
        eventDurationHours: $eventDurationHours, attendees: $attendees, 
        classMinimum: $classMinimum, pricePerson: $pricePerson, 
        serviceFee: $serviceFee, salesTax: $salesTax, discount: $discount, 
        status: $status, createdAt: $createdAt, updatedAt: $updatedAt
        }) {
     _id
     date
     expirationHours
     teamClassId
     classVariant {
         title
         notes
         minimum
         duration
         pricePerson
         hasKit
         order
         active
     }
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
     createdAt 
     updatedAt
  }
}`