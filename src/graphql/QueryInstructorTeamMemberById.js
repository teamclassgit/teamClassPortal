import { gql } from "@apollo/client";

export default gql`
  query getInstructorTeamMemberById($instructorTeamMemberId: String!) {
    instructorTeamMember(query: { _id: $instructorTeamMemberId }) {
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
