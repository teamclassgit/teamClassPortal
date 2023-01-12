import { gql } from "@apollo/client";

export default gql`
  mutation payEventToDistributor($bookingId: String!) {
    payEventToDistributor(input: { bookingId: $bookingId }) {
      executed
      message
    }
  }
`;
