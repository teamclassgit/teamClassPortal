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
      joinInfo {
        joinUrl
        password
      }
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