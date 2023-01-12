import { gql } from "@apollo/client";

export default gql`
  mutation updateBookingStatus($id: String!, $status: String!, $updatedAt: DateTime!) {
    updateOneBooking(query: { _id: $id }, set: { status: $status, updatedAt: $updatedAt }) {
      _id
      date
      expirationHours
      teamClassId
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
      taxExempt
      discount
      status
      rushFee
      createdAt
      updatedAt
    }
  }
`;
