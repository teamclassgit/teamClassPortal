import { gql } from "@apollo/client";

export default gql`
  mutation createTwilioConversation($bookingId: String!) {
    createTwilioConversations(input: { bookingId: $bookingId }) {
      executed
      message
      sidConversation
    }
  }
`;
