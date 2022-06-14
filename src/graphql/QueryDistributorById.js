import { gql } from '@apollo/client';

export default gql`
  query getDistributor($distributorId: String!) {
    distributor(query: { _id: $distributorId }) {
      _id
      name
      email
      createdAt
      updatedAt
      phone
      company
      stripeConnect {
        accountId
        createdAt
        failedMessage
        onboardingDeadline
        onboardingURL
        status
        updatedAt
      }
    }
  }
`;
