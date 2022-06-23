import { gql } from '@apollo/client';

export default gql`
  mutation updateBooking(
    $bookingId: String!
    $status: String
    $rejectedReasons: String
    $createdAt: DateTime
    $updatedAt: DateTime
    $invoiceItems: [BookingDistributorInvoiceInvoiceItemUpdateInput]
    $notes: String
    $paymentReceipt: String
  ) {
    updateOneBooking(
      query: { _id: $bookingId }
      set: {
        distributorInvoice: {
          status: $status
          rejectedReasons: $rejectedReasons
          createdAt: $createdAt
          invoiceItems: $invoiceItems
          notes: $notes
          updatedAt: $updatedAt
          paymentReceipt: $paymentReceipt
        }
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
      instructorInvoice {
        createdAt
        invoiceItems {
          description
          price
          units
        }
        notes
        rejectedReasons
        status
        updatedAt
        paymentReceipt
      }
      distributorInvoice {
        createdAt
        invoiceItems {
          description
          price
          units
        }
        notes
        rejectedReasons
        status
        updatedAt
        paymentReceipt
      }
      createdAt
      createdAt
      updatedAt
    }
  }
`;
