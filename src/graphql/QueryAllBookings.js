import {gql} from "@apollo/client"

export default gql`
query GetBookings($filter:TableBookingFilterInput!) {
  listBookings(limit: 10000,filter: $filter) {
    items {
         id
         date
         teamClassId
         customerId
         customerName
         attendees
         status
         createdAt 
         updatedAt
    }
  }
}`
