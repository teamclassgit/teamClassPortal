import { gql } from "@apollo/client";

export default gql`
  query GetCoordinators($filter: EventCoordinatorQueryInput) {
    eventCoordinators(query: $filter) {
      _id
      name
      email
      default
      crmId
      phone
      twilioPhone
      calendlyLink
    }
  }
`;