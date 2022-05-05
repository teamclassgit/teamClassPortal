import { gql } from "@apollo/client";

export default gql`
  mutation sendEmailConferenceLinkChangedByInstructor($bookingId: String!) {
    sendEmailConferenceLinkChangedByInstructor(input: { bookingId: $bookingId }) {
      executed
      message
    }
  }
`;
