import { gql } from "@apollo/client";

export default gql`
  query GetDistributors($filter: DistributorQueryInput) {
    distributors(query: $filter, sortBy: NAME_ASC) {
        _id
        name
        email
        createdAt
        updatedAt
        phone
        company
        emailCCList
        active
        specialFeatures {
          invoicing
          fulfillment
        }
    }
  }
`;
