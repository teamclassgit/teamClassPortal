import { gql } from "@apollo/client";

export default gql`
  mutation updateBookingNotes($id: String!, $notes: [BookingNoteUpdateInput!], $updatedAt: DateTime!) {
    updateOneBooking(query: { _id: $id }, set: { notes: $notes, updatedAt: $updatedAt }) {
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
        shared
      }
      classVariant {
        title
        minimum
        maximum
        pricePerson
        hasKit
        groupEvent
        instructorFlatFee
        registrationFields {
          label
          placeholder
          type
          listItems
          required
          active
          order
        }
      }
      createdAt
      updatedAt
      signUpDeadline
    }
  }
`;
