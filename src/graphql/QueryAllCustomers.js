import { gql } from '@apollo/client'

export default gql`
  query GetCustomers($filter: CustomerQueryInput!) {
    customers(limit: 10000, query: $filter) {
        _id
        name
        email
        company
        phone
    }
  }
`
