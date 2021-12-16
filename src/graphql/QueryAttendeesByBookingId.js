import { gql } from '@apollo/client';

export default gql`
  query ListAttendees($bookingId: String!) {
    attendees(query: { bookingId: $bookingId }, limit: 1000) {
      _id
      bookingId
      name
      addressLine1
      addressLine2
      additionalFields {
        name
        order
        value
      }
      city
      state
      zip
      country
      email
      phone
      canDeliverKit
      canDeliverKitReason
      kitFullFitment {
        shipmentTrackingNumber
        carrier
      }
    }
  }
`;
