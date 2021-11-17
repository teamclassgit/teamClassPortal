import { gql } from '@apollo/client';

export default gql`
  mutation updateBookingAndCustomer(
    $bookingId: String!
    $date: DateTime!
    $teamClassId: String!
    $classVariant: BookingClassVariantUpdateInput!
    $notes: [BookingNoteUpdateInput]
    $instructorId: String
    $instructorName: String
    $customerId: String!
    $customerName: String!
    $eventDate: DateTime!
    $eventDurationHours: Float
    $eventCoordinatorId: String!
    $attendees: Int!
    $classMinimum: Int!
    $pricePerson: Float!
    $salesTax: Float!
    $serviceFee: Float!
    $discount: Float!
    $createdAt: DateTime!
    $updatedAt: DateTime!
    $signUpDeadline: DateTime
    $status: String!
    $phone: String!
    $email: String!
    $company: String
    $closedReason: String
  ) {
    updateOneCustomer(
      query: { _id: $customerId }
      set: { _id: $customerId, name: $customerName, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }
    ) {
      _id
      name
      email
      phone
      company
      billingAddress {
        addressLine1
        addressLine2
        city
        state
        country
        zip
      }
      createdAt
      updatedAt
    }
    updateOneCalendarEvent(query: { bookingId: $bookingId }, set: { classId: $teamClassId }) {
      _id
      classId
      bookingId
      year
      month
      day
      fromHour
      fromMinutes
      toHour
      toMinutes
      status
      rushFee
    }
    updateOneBooking(
      query: { _id: $bookingId }
      set: {
        _id: $bookingId
        date: $date
        expirationHours: 48
        classVariant: $classVariant
        notes: $notes
        teamClassId: $teamClassId
        instructorId: $instructorId
        instructorName: $instructorName
        customerId: $customerId
        customerName: $customerName
        eventDate: $eventDate
        eventDurationHours: $eventDurationHours
        eventCoordinatorId: $eventCoordinatorId
        attendees: $attendees
        classMinimum: $classMinimum
        pricePerson: $pricePerson
        serviceFee: $serviceFee
        salesTax: $salesTax
        discount: $discount
        status: $status
        createdAt: $createdAt
        updatedAt: $updatedAt
        signUpDeadline: $signUpDeadline
        closedReason: $closedReason
      }
    ) {
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
        minimum
        maximum
        pricePerson
        hasKit
        groupEvent
      }
      createdAt
      updatedAt
      signUpDeadline
    }
  }
`;
