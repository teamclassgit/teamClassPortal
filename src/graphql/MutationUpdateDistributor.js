import { gql } from "@apollo/client";

export default gql`
  mutation updateDistributor(
    $id: String!
    $name: String!
    $email: String!
    $phone: String
    $company: String
    $updatedAt: DateTime
    $emailCCList: String
    $invoicing: Boolean
    $fulfillment: Boolean
  ) {
    updateOneDistributor(
      query: {_id: $id},
      set: {
        _id:  $id
        name: $name
        email: $email
        phone: $phone
        company: $company
        updatedAt: $updatedAt
        emailCCList: $emailCCList
        specialFeatures: {
          invoicing: $invoicing
          fulfillment: $fulfillment
        }
      }) {
        _id
        name
        email
        phone
        company
        updatedAt
        emailCCList
        active
        specialFeatures {
          invoicing
          fulfillment
        }
    }
}`;
