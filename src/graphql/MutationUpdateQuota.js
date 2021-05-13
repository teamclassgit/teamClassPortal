import {gql} from "@apollo/client"

export default gql`
mutation updateQuota(
  $id:ID!,
  $eventDate: AWSDateTime!, 
  $attendees: Int!, 
  $serviceFee: Float!, 
  $salesTax: Float!,  
  $discount: Float!, 
  $updatedAt: AWSDateTime!
  $status: String!
  $instructorId: ID!,
  $instructorName: String!, 
  $customerId: ID!, 
  $customerName: String!, 
) {
   updateBooking(
    input: {
        id: $id, instructorId: $instructorId, instructorName: $instructorName
        customerId: $customerId, customerName:$customerName,
        eventDate: $eventDate, 
        attendees: $attendees,
        serviceFee: $serviceFee, 
        salesTax: $salesTax, 
        discount: $discount, 
        updatedAt: $updatedAt,
        status: $status        
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