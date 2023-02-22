import { gql } from "@apollo/client";

export default gql`
  mutation updateBookingStatusToOpen(
    $bookingId: String!,
    $status: String!,
    $updatedAt: DateTime!
    $teamClassId: String!
    $classVariant: BookingClassVariantUpdateInput!
    $addons: [BookingAddonUpdateInput]
    $attendees: Int!
    $distributorId: String
    $distributorId_unset: Boolean
    $instructorId: String
    $instructorName: String
    $closedReason_unset: Boolean
    $onDemand: Boolean
  ) {
    updateOneBooking(
      query: { _id: $bookingId },
      set: {
        status: $status,
        updatedAt: $updatedAt,
        classVariant: $classVariant
        teamClassId: $teamClassId
        instructorId: $instructorId
        instructorName: $instructorName
        distributorId: $distributorId
        distributorId_unset: $distributorId_unset
        addons: $addons
        attendees: $attendees
        closedReason_unset: $closedReason_unset
        onDemand: $onDemand
      }
    ) {
      _id
      teamClassId
      customerId
      customerName
      attendees
      classMinimum
      onDemand
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
      taxExempt
      payments {
        amount
        paymentId
        paymentName
        status
        refund {
          createdAt
          refundAmount
          refundId
          refundReasons
        }
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
        instructorFlatFee
        pricePersonInstructor
        expectedProfit
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
      createdAt
      updatedAt
      signUpDeadline
      addons {
        active
        color
        description
        icon
        multipleUnits
        order
        name
        unit
        unitPrice
      }
    }
  }
`;
