import { gql } from '@apollo/client';

export default gql`
  query getGiftBaskes($filter: GiftBasketQueryInput) {
    giftBaskets(query: $filter) {
      _id
      category
      description
      internationalShipping
      kitIncludes
      personalized
      title
      variants {
        active
        order
        personalizations {
          inputType
          name
        }
        personalized
        priceBasket
        shippingIncluded
        title
      }
    }
  }
`;
