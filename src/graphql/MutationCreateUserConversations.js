import { gql } from "@apollo/client";

export default gql`
  mutation createUserTwilioConversations(
    $identity: String!
  ) {
    createUserTwilioConversations(
      input: {
          identity: $identity
        }) {
        executed
      message
    }
  }`;