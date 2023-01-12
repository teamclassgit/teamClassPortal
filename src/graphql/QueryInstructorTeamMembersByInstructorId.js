import { gql } from "@apollo/client";

export default gql`
  query getInstructorTeamMemberById($instructorId: String!) {
    instructorTeamMember(query: { _id: $instructorId }) {
      _id
      createdAt
      email
      name
      phone
      updatedAt
      instructorId
    }
  }
`;
