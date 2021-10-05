import { gql } from '@apollo/client'

export default gql`
  mutation updateQuote(
    $bookingId: String!
    $customerId: String!
    $name: String!
    $phone: String!
    $email: String!
    $company: String
    $updatedAt: DateTime!
  ) {
    updateOneCustomer(query: { _id: $customerId }, set: { name: $name, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }) {
      _id
      name
      email
      phone
      company
      createdAt
      updatedAt
    }
    updateOneBooking(query: { _id: $bookingId }, set: { customerName: $name, updatedAt: $updatedAt }) {
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
      discount
      status
      rushFee
      createdAt
      updatedAt
    }
  }
`
