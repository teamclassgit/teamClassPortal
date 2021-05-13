import {gql} from "@apollo/client"

export default gql`
query GetBooking($bookingId:ID!) {
  getBooking(id: $bookingId) {
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