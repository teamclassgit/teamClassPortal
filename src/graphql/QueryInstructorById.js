import { gql } from "@apollo/client";

export default gql`
  query getInstructorById($instructorId: String!) {
    instructor(query: { _id: $instructorId }) {
      _id
      name
      email
      phone
      createdAt
      updatedAt
    }
  }
`;
