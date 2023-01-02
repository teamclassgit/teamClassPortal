import { gql } from "@apollo/client";

export default gql`
  mutation creatingAccessTokenTwilio(
    $identity: String!
  ) {
    creatingAccessTokenTwilio(
      input: {
        identity: $identity
      }) {
      token
    }
  }
`;