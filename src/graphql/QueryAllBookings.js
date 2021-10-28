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
      eventCoordinatorId
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
        status
      }
      classVariant {
        title
        minimum
        maximum
        pricePerson
        hasKit
        groupEvent
      }
      createdAt
      updatedAt
    }
  }
`
