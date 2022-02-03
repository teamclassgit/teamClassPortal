import { gql } from '@apollo/client';

export default gql`
  mutation insertBookingAndCustomer(
    $bookingId: String!
    $date: DateTime!
    $teamClassId: String!
    $classVariant: BookingClassVariantInsertInput!
    $notes: [BookingNoteInsertInput!]
    $instructorId: String
    $instructorName: String
    $customerId: String!
    $customerName: String!
    $eventDurationHours: Float!
    $eventCoordinatorId: String!
    $attendees: Int!
    $classMinimum: Int!
    $pricePerson: Float!
    $salesTax: Float!
    $salesTaxState: String!
    $serviceFee: Float!
    $discount: Float!
    $createdAt: DateTime!
    $customerCreatedAt: DateTime!
    $updatedAt: DateTime!
    $signUpDeadline: DateTime
    $status: String!
    $phone: String!
    $email: String!
    $billingAddress: CustomerBillingAddressInsertInput
    $company: String
    $closedReason: String
  ) {
    upsertOneCustomer(
      query: { _id: $customerId }
      data: {
        _id: $customerId
        name: $customerName
        phone: $phone
        email: $email
        company: $company
        updatedAt: $updatedAt
        createdAt: $customerCreatedAt
        billingAddress: $billingAddress
      }
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
    insertOneBooking(
      data: {
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
        eventDurationHours: $eventDurationHours
        eventCoordinatorId: $eventCoordinatorId
        attendees: $attendees
        classMinimum: $classMinimum
        pricePerson: $pricePerson
        serviceFee: $serviceFee
        salesTax: $salesTax
        salesTaxState: $salesTaxState
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
      salesTaxState
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
      }
      createdAt
      updatedAt
      signUpDeadline
    }
  }
`;
