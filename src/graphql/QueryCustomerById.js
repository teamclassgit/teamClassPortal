import {gql} from "@apollo/client"

export default gql`
query GetCustomer($customerId:ID!) {
  getCustomer(id: $customerId) {
      id
      name
      email
      phone
      company
      createdAt
      updatedAt
  }
}`