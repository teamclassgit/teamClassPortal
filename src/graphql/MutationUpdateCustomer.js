import {gql} from "@apollo/client"

export default gql`
mutation updateCustomer(
  $id:ID!,
  $name: String!, 
  $phone: String!, 
  $email: String,
  $company: String,
  $updatedAt: AWSDateTime!,
) {
   updateCustomer(
     input: {
              id: $id
              name: $name, 
              phone: $phone,
              email: $email, 
              company: $company, 
              updatedAt: $updatedAt
          }) {
     id
     name
     email
     phone
     company
     createdAt
     updatedAt 
  }
}`