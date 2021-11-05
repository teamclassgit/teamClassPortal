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
      closedReason
      eventLink
      signUpStatusLink
      checkoutLink
      payments {
        amount
        paymentId
        paymentName
        status
      }
      notes {
        note
        author
        date
      }
      classVariant {
        title
        notes
        minimum
        maximum
        duration
        pricePerson
        hasKit
        order
        active
        groupEvent
      }
      createdAt
      updatedAt
      signUpDeadline
    }
  }
`
