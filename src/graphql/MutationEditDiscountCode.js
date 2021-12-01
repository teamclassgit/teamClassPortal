import { gql } from "@apollo/client";

export default gql`
mutation EditDiscountCode(
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
  updateOneDiscountCode(query: { _id: $id, createdAt: $createdAt }, set: { discountCode: $discountCode, description: $description, expirationDate: $expirationDate, redemptions: $redemptions, customerId: $customerId, updatedAt: $updatedAt, type: $type, discount: $discount, maxDiscount: $maxDiscount, active: $active }) {
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