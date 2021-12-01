import { gql } from '@apollo/client';

export default gql`
query GetDicountCode($filter: DiscountCodeQueryInput!) {
  discountCodes(limit: 100, query: $filter) {
      _id
      discountCode
      description
      expirationDate
      redemptions
      customerId
      createdAt
      updatedAt
      type
      discount
      maxDiscount
      active
    }
  }
`;
