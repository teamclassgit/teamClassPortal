import { gql } from '@apollo/client';

export default gql`
  mutation payEventToInstructor($bookingId: String!) {
    payEventToInstructor(input: { bookingId: $bookingId }) {
      executed
      message
    }
  }
`;
