import { gql } from '@apollo/client'

export default gql`
  mutation updateBooking(
    $bookingId: ID!
    $customerId: ID!
    $name: String!
    $phone: String!
    $email: String
    $company: String
    $updatedAt: AWSDateTime!
    $attendees: Int!
    $instructorId: ID!
    $instructorName: String!
    $pricePerson: Float!
    $classMinimum: Int!
    $teamClassId: ID!
    $duration: Float!
  ) {
    updateCustomer(input: { id: $customerId, name: $name, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }) {
      id
      name
      email
      phone
      company
      createdAt
      updatedAt
    }
    updateBooking(
      input: {
        id: $bookingId
        customerName: $name
        updatedAt: $updatedAt
        attendees: $attendees
        classMinimum: $classMinimum
        pricePerson: $pricePerson
        teamClassId: $teamClassId
        instructorId: $instructorId
        instructorName: $instructorName
        eventDurationHours: $duration
      }
    ) {
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
