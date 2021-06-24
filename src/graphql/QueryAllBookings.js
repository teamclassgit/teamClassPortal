import { gql } from '@apollo/client'

export default gql`
  query GetBookings($filter: TableBookingFilterInput!) {
    listBookings(limit: 10000, filter: $filter) {
      items {
        id
        teamClassId
        customerId
        customerName
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
    }
  }
`
