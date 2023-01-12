import { gql } from "@apollo/client";

export default gql`
  query GetInstructors($filter: InstructorQueryInput) {
    instructors(query: $filter, sortBy: NAME_ASC) {
      _id
      company
      email
      name
      phone
      emailCCList
      active
      specialFeatures {
        invoicing
        fulfillment
      }
    }
  }
`;
