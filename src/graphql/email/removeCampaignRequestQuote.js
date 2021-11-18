import { gql } from "@apollo/client";

export default gql`
  mutation removeCampaignRequestQuote($customerEmail: String!) {
    removeCampaignRequestQuote(input: { email: $customerEmail }) {
      executed
    }
  }
`;
