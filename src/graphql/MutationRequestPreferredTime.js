import { gql } from "@apollo/client";

export default gql`
mutation requestPreferredTime(
  $id: String!,
  $classId: String!, 
  $bookingId: String!,
  $year: Int!, 
  $month: Int!, 
  $day: Int!,
  $fromHour: Int!,
  $fromMinutes: Int!,
  $toHour: Int!,
  $toMinutes: Int!,
  $status: String!,
  $bookingStatus: String!,
  $isRushFee: Boolean!,
  $rushFee: Float!,
  $timezone: String
  $timezoneLabel: String
  $displayTimezone: String
  $displayTimezoneLabel: String
  $updatedAt: DateTime!
) {
   upsertOneCalendarEvent(
     query: {_id:$id},
     data: {
              _id: $id,
              classId:$classId,
              bookingId:$bookingId,
              year:$year, 
              month:$month 
              day:$day
              fromHour:$fromHour
              fromMinutes:$fromMinutes
              toHour:$toHour
              toMinutes:$toMinutes
              status:$status
              rushFee:$isRushFee
              timezone:$timezone
              timezoneLabel:$timezoneLabel
              displayTimezone: $displayTimezone
              displayTimezoneLabel: $displayTimezoneLabel
          }) {
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
      timezone
      timezoneLabel
      displayTimezone
      displayTimezoneLabel
  }
  updateOneBooking(query: {_id: $bookingId}, set: {updatedAt: $updatedAt, status: $bookingStatus, rushFee:$rushFee}) {
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
}`;
