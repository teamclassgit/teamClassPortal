import {gql} from "@apollo/client"

export default gql`
mutation createQuota(
  $date: AWSDateTime!, 
  $teamClassId: ID!, 
  $instructorId: ID!,
  $instructorName: String!, 
  $customerId: ID!, 
  $customerName: String!, 
  $customerIntro: String,
  $eventDate: AWSDateTime!, 
  $eventDurationHours: Float!, 
  $attendees: Int!, 
  $classMinimum: Int!,
  $pricePerson: Float!, 
  $salesTax: Float!,
  $serviceFee: Float!, 
  $discount: Float!, 
  $createdAt: AWSDateTime!, 
  $updatedAt: AWSDateTime!,
  $status: String!
) {

   createBooking(
    input: {
        date: $date, expirationHours: 48, 
        teamClassId: $teamClassId, instructorId: $instructorId, instructorName: $instructorName
        customerId: $customerId, customerName:$customerName, customerIntro:$customerIntro, eventDate: $eventDate, 
        eventDurationHours: $eventDurationHours, attendees: $attendees, 
        classMinimum: $classMinimum, pricePerson: $pricePerson, 
        serviceFee: $serviceFee, salesTax: $salesTax, discount: $discount, 
        status: $status, createdAt: $createdAt, updatedAt: $updatedAt
        }) {
     id
     date
     expirationHours
     teamClassId
     instructorId
     instructorName
     customerId
     customerName 
     customerIntro
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