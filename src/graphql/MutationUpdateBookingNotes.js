import { gql } from '@apollo/client'

export default gql`
  mutation updateBookingNotes($id: String!, $notes: [BookingNoteUpdateInput], $updatedAt: DateTime!) {
    updateOneBooking(query: { _id: $id }, set: { notes: $notes, updatedAt: $updatedAt }) {
      _id
      date
      expirationHours
      teamClassId
      eventCoordinatorId
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
      notes {
        note
        author
        date
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
      salesTaxState
      discount
      status
      eventLink
      signUpStatusLink
      checkoutLink
      createdAt
      createdAt
      updatedAt
      signUpDeadline
      closedReason
    }
  }
`
