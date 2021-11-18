import { gql } from "@apollo/client";

export default gql`
mutation createCustomer(
  $id: String!,
  $name: String!, 
  $email: String!, 
  $phone: String!, 
  $company: String, 
  $createdAt: DateTime!,
  $updatedAt: DateTime!
) {
   insertOneCustomer(
     data: {
              _id: $id,
              name: $name, 
              email: $email, 
              phone: $phone, 
              company: $company, 
              createdAt: $createdAt,
              updatedAt: $updatedAt
          }) {
            _id
            name
            email
            phone
            company
            billingAddress {
              addressLine1
              addressLine2
              city
              state
              country
              zip
            }
            createdAt
            updatedAt
  }
}`;