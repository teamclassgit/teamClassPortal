import { gql } from '@apollo/client'

export default gql`
  mutation updateBookingStatus($id: ID!, $status: String!, $updatedAt: AWSDateTime!) {
    updateBooking(input: { id: $id, status: $status, updatedAt: $updatedAt }) {
      id
      date
      expirationHours
      teamClassId
      instructorId
      instructorName
      customerId
      customerName
      customerIntro
      eventDate
      eventDurationHours
      attendees
      classMinimum
      pricePerson
      serviceFee
      salesTax
      discount
      status
      rushFee
      createdAt
      updatedAt
    }
  }
`
