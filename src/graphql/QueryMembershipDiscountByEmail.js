import { gql } from "@apollo/client";

export default gql`
  query queryUserMembershipDataByEmail($email: String!) {
    getMembershipInfo(input: $email) {
      name
      active
      discount
      messages
      type
      amount
      frequency
    }
  }
`;
