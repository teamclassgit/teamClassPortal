import { gql } from '@apollo/client'

export default gql`
  query GetBookings($filter: BookingQueryInput!, $limit: Int!) {
    bookings(limit: $limit, query: $filter, sortBy: UPDATEDAT_DESC) {
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
      eventLink
      signUpStatusLink
      checkoutLink
      payments {
        amount
        paymentId
        paymentName
      }
      classVariant {
        title
      }
      createdAt
      updatedAt
    }
  }
`
