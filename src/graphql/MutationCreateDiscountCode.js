import { gql } from "@apollo/client";

export default gql`
mutation createDiscountCode(
  $id: String!,
  $discountCode: String!, 
  $description: String!, 
  $expirationDate: DateTime!, 
  $redemptions: Int!, 
  $customerId: String,
  $createdAt: DateTime!,
  $updatedAt: DateTime!
  $type: String!
  $discount: Float!
  $maxDiscount: Float!
  $active: Boolean!
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