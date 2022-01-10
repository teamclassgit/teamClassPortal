import { gql } from '@apollo/client';

export default gql`
  query GetAllGiftBasketPurchases($filter: GiftBasketPurchaseQueryInput!) {
    giftBasketPurchases(query: $filter) {
      customerName
      customerId
      shippingAddress {
        name
        address1
        address2
        state
        city
        zip
        country
      }
      basketsPurchased {
        priceBasket
        variantName
        quantity
        basketId
      }
      payments {
        amount
        country
        createdAt
        status
      }
      personalizations {
        name
        value
      }
      timePurchased
    }
  }
`;
