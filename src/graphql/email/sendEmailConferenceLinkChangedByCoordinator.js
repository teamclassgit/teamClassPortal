import { gql } from '@apollo/client';

export default gql`
  mutation sendEmailConferenceLinkChangedByInstructor($bookingId: String!) {
    sendEmailConferenceLinkChangedByCoordinator(input: { bookingId: $bookingId }) {
      executed
      message
    }
  }
`;
