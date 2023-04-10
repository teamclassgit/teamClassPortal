import { gql } from "@apollo/client";

export default gql`
  mutation updateBookingSettingsAndLinks (
    $bookingId: String!
    $date: DateTime!
    $link: String!
    $password: String!
    $who: String!
    $shippingTrackingLink: String
    $additionalClassOptions: [BookingAdditionalClassOptionUpdateInput]
    $tags: [String]
  ) {
    updateJoinInfo(
      input: {
        bookingId: $bookingId,
        link: $link,
        password: $password,
        who: $who
      }
    ) {
      _id
     attendees
     bookingGroupId
     capRegistration
     ccFeeExempt
     checkoutLink
     classMinimum
     closedReason
     createdAt
     customerId
     customerName
     date
     depositInvoiceId
     depositInvoiceUrl
     discount
     distributorId
     eventCoordinatorId
     eventDate
     eventDurationHours
     eventLink
     expirationHours
     finalPaymentInvoiceId
     finalPaymentInvoiceUrl
     gclid
     hasInternationalAttendees
     instantBooking
     instructorId
     instructorName
     instructorTeamMemberId
     largeEvent
     membershipDiscount
     onDemand
     onDemandVideoLink
     preferedContactMedium
     preferedContactTime
     pricePerson
     rushFee
     salesTax
     salesTaxState
     serviceFee
     shippingTrackingLink
     signUpDeadline
     signUpStatusLink
     status
     taxExempt
     teamClassId
     updatedAt
     utm_campaign
     utm_content
     utm_medium
     utm_source
     utm_term
     joinInfo{
      joinUrl
      password
    }
     shippingTrackingLink
    }

    updateOneBooking(
      query: { _id: $bookingId }
      set: {
        date: $date
        shippingTrackingLink: $shippingTrackingLink
        additionalClassOptions: $additionalClassOptions
        tags: $tags
      }
    ) {
      _id
      date
      tags
      additionalClassOptions {
        groupId
        text
      }
      shippingTrackingLink
    }
  }
`;