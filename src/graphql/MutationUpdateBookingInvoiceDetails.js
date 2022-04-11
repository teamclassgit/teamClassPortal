import { gql } from '@apollo/client';

export default gql`
  mutation updateBookingInvoiceDetails(
    $bookingId: String!
    $invoiceDetails: [BookingInvoiceDetailUpdateInput!]!
    $discount: Float!
    $salesTax: Float!
    $salesTaxState: String
    $updatedAt: DateTime!
    $taxExempt: Boolean!
    $ccFeeExempt: Boolean!
    $rushFee: Boolean!
    $classMinimum: Int!
    $classVariant: BookingClassVariantUpdateInput!
    $rushFeeValue: Float!
  ) {
    updateOneCalendarEvent(query: { bookingId: $bookingId }, set: { rushFee: $rushFee }) {
      _id
      classId
      fromHour
      bookingId
      toHour
      month
      fromMinutes
      status
      year
      day
      toMinutes
      rushFee
    }
    updateOneBooking(
      query: { _id: $bookingId }
      set: {
        discount: $discount
        invoiceDetails: $invoiceDetails
        updatedAt: $updatedAt
        taxExempt: $taxExempt
        ccFeeExempt: $ccFeeExempt
        salesTax: $salesTax
        salesTaxState: $salesTaxState
        classMinimum: $classMinimum
        classVariant: $classVariant
        rushFee: $rushFeeValue
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
      rushFee
      salesTax
      salesTaxState
      discount
      status
      eventLink
      signUpStatusLink
      checkoutLink
      taxExempt
      ccFeeExempt
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
`;
