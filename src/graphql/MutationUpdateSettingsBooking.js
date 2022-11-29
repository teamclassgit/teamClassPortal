import { gql } from "@apollo/client";

export default gql `
  mutation updateSettingsBooking (
    $bookingId: String!
    $date: DateTime!
    $joinInfo: BookingJoinInfoUpdateInput
    $joinInfo_unset: Boolean
    $shippingTrackingLink: String
    $additionalClassOptions: [BookingAdditionalClassOptionUpdateInput]
    $tags: [String]
  ) {
    updateOneBooking(
      query: { _id: $bookingId }
      set: {
        date: $date
        joinInfo: $joinInfo
        joinInfo_unset: $joinInfo_unset
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
      joinInfo {
        eventId
        joinUrl
        manualLink
        password
      }
    }
  }
`;
