import { gql } from "@apollo/client";

export default gql`
  mutation sendEmailTrackingLinkChanged($bookingId: String!, $isDistributor: Boolean!) {
    sendEmailTrackingLinkChanged(input: { bookingId: $bookingId, isDistributor: $isDistributor }) {
      executed
      message
    }
  }
`;
