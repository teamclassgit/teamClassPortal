import { gql } from "@apollo/client";

export default gql`
mutation createDiscountCode(
  $active: Boolean!
  $createdAt: DateTime!,
  $customerId: String,
  $description: String!, 
  $discount: Float!
  $discountCode: String!, 
  $expirationDate: DateTime!, 
  $id: String!,
  $maxDiscount: Float!
  $redemptions: Int!, 
  $type: String!
  $updatedAt: DateTime!
) {
    insertOneDiscountCode(
     data: {
        _id: $id,
        discountCode: $discountCode,
        description: $description,
        expirationDate: $expirationDate, 
        redemptions: $redemptions,
        customerId: $customerId,
        createdAt: $createdAt,
        updatedAt: $updatedAt,
        type: $type,
        discount: $discount,
        maxDiscount: $maxDiscount,
        active: $active
          }) {
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
}`;