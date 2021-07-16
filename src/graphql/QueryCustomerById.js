import {gql} from "@apollo/client"

export default gql`
query GetCustomer($customerId:String!) {
  customer(query : { _id: $customerId} ) {
      _id
      name
      email
      phone
      company
      createdAt
      updatedAt
  }
}`