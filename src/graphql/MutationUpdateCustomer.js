import {gql} from "@apollo/client"

export default gql`
mutation updateCustomer(
  $id:String!,
  $name: String!, 
  $phone: String!, 
  $email: String,
  $company: String,
  $updatedAt: DateTime!,
) {
   updateOneCustomer(
     query: {_id: $id},
     data: {
              name: $name, 
              phone: $phone,
              email: $email, 
              company: $company, 
              updatedAt: $updatedAt
          }) {
     _id
     name
     email
     phone
     company
     createdAt
     updatedAt 
  }
}`