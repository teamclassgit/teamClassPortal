import { gql } from "@apollo/client";

export default gql`
  query GetBookingAndCalendarEvent($bookingId: String!) {
    calendarEvent(query: { bookingId: $bookingId }) {
      _id
      classId
      bookingId
      status
      toHour
      toMinutes
      year
      day
      fromHour
      fromMinutes
      month
      rushFee
      timezone
      timezoneLabel
      displayTimezone
      displayTimezoneLabel
    }
    booking(query: { _id: $bookingId }) {
      _id
      date
      expirationHours
      teamClassId
      eventCoordinatorId
      instructorTeamMemberId
      hasInternationalAttendees
      onDemand
      classVariant {
        title
        notes
        minimum
        maximum
        duration
        pricePerson
        pricePersonInstructor
        expectedProfit
        hasKit
        order
        active
        groupEvent
        kitHasAlcohol
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
      notes {
        note
        author
        date
        shared
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
      preEventSurvey {
        submittedAt
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
        refund {
          createdAt
          refundAmount
          refundId
          refundReasons
        }
      }
      instructorId
      instructorName
      customerId
      customerName
      distributorId
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
      closedReason
      eventLink
      signUpStatusLink
      checkoutLink
      taxExempt
      ccFeeExempt
      capRegistration
      additionalClassOptions {
        groupId
        text
      }
      tags
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
      signUpDeadline
      shippingTrackingLink
      joinInfo {
        eventId
        joinUrl
        manualLink
        password
      }
    }
  }
`;
