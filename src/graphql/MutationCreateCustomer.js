import {gql} from "@apollo/client"

export default gql`
mutation createCustomer(
  $name: String!, 
  $email: String!, 
  $phone: String!, 
  $company: String, 
  $createdAt: AWSDateTime!,
  $updatedAt: AWSDateTime!,
) {
   createCustomer(
     input: {
              name: $name, 
              email: $email, 
              phone: $phone, 
              company: $company, 
              createdAt: $createdAt,
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