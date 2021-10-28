import { gql } from '@apollo/client'

export default gql`
  mutation upsertBooking(
    $bookingId: String!
    $date: DateTime!
    $teamClassId: String!
    $classVariant: BookingClassVariantInsertInput!
    $instructorId: String
    $instructorName: String
    $customerId: String!
    $customerName: String!
    $eventDate: DateTime!
    $eventDurationHours: Float!
    $eventCoordinatorId: String!
    $attendees: Int!
    $classMinimum: Int!
    $pricePerson: Float!
    $salesTax: Float!
    $serviceFee: Float!
    $discount: Float!
    $createdAt: DateTime!
    $updatedAt: DateTime!
    $status: String!
    $phone: String!
    $email: String
    $company: String
  ) {
    upsertOneCustomer(
      query: { _id: $customerId }
      data: { _id: $customerId, name: $customerName, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }
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
    upsertOneBooking(
      query: { _id: $bookingId }
      data: {
        _id: $bookingId
        date: $date
        expirationHours: 48
        classVariant: $classVariant
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
      }
    ) {
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
      addons {
        icon
        color
        name
        description
        multipleUnits
        unitPrice
        unit
        order
        active
      }
      payments {
        addressLine1
        addressLine2
        amount
        cardBrand
        cardExpMonth
        cardExpYear
        cardLast4
        cardFunding
        cardCountry
        chargeUrl
        city
        country
        createdAt
        email
        livemode
        name
        paymentId
        paymentName
        paymentMethod
        phone
        state
        status
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
      invoiceDetails {
        item
        unitPrice
        units
        priceEditable
        unitsEditable
        taxable
        readOnly
      }
      createdAt
      createdAt
      updatedAt
    }
  }
`
