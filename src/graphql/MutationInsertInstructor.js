import { gql } from "@apollo/client";

export default gql`
  mutation insertOneInstructor(
    $id: String!
    $name: String!
    $email: String!
    $phone: String
    $company: String
    $createdAt: DateTime
    $updatedAt: DateTime
    $emailCCList: String
    $invoicing: Boolean
    $active: Boolean
  ){
    insertOneInstructor(
      data:{
        _id:  $id
        name: $name
        email: $email
        phone: $phone
        company: $company
        createdAt: $createdAt
        updatedAt: $updatedAt
        emailCCList: $emailCCList
        active: $active
        specialFeatures: {
            invoicing: $invoicing
        }
      }
    ){
      _id
      name
      email
      phone
      company
      createdAt
      updatedAt
      emailCCList
      active
      specialFeatures {
        invoicing
      }
    }
  }
`;
