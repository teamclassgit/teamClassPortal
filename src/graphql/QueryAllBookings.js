import { gql } from '@apollo/client'

export default gql`
  query GetBookings($filter: BookingQueryInput!) {
    bookings(limit: 10000, query: $filter, sortBy: CREATEDAT_DESC) {
        _id
        teamClassId
        customerId
        customerName
        attendees
        classMinimum
        eventDurationHours
        pricePerson
        serviceFee
        salesTax
        rushFee
        discount
        status
        createdAt
        updatedAt
    }
  }
`
