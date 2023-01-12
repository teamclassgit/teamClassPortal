import { gql } from "@apollo/client";

export default gql`
  mutation UpdateUsersData(
    $id: String!
    $name: String!
    $email: String!
    $role: String!
    $description: String!
    $status: String!
  ) {
    updateOneUserDatum(query: { _id: $id, name: $name, email: $email, role: $role }, set: { description: $description, status: $status }) {
      _id
      name
      email
      role
      description
      status
    }
  }
`;
