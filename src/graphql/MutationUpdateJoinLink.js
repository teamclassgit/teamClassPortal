import { gql } from "@apollo/client";

export default gql`
  mutation updateJoinLink (
    $bookingId: String!
    $link: String!
    $password: String!
    $who: String!
  ) {
    updateJoinInfo(
      input: {
        bookingId: $bookingId,
        link: $link,
        password: $password,
        who: $who
      }
    ) {
      success
      message
    }
  }
`;