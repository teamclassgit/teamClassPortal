import { gql } from '@apollo/client'

export default gql`
  query GetBooking($bookingId: String!) {
    booking(query: { _id: $bookingId }) {
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
