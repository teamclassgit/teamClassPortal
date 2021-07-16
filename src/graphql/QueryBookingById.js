import {gql} from "@apollo/client"

export default gql`
query GetBooking($bookingId:String!) {
  booking(query: {_id: $bookingId}) {
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