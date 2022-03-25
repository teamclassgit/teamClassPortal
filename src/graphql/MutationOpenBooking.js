import { gql } from '@apollo/client';

export default gql`
  mutation updateBookingStatusToOpen($bookingId: String!, $status: String!, $updatedAt: DateTime!) {
    updateOneBooking(query: { _id: $bookingId }, set: { status: $status, closedReason: "", updatedAt: $updatedAt }) {
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
      taxExempt
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
        minimum
        maximum
        pricePerson
        hasKit
        groupEvent
        instructorFlatFee
      }
      createdAt
      updatedAt
      signUpDeadline
    }
  }
`;
