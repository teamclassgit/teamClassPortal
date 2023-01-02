import { gql } from "@apollo/client";

export default gql`
  query GetUsersData {
    userData {
      _id
      name
      email
      role
      createdAt
    }
  }
`;
