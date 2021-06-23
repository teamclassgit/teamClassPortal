import { gql } from '@apollo/client'

export default gql`
  query GetCustomers($filter: TableCustomerFilterInput!) {
    listCustomers(limit: 1000, filter: $filter) {
      items {
        id
        name
        email
        company
        phone
      }
    }
  }
`
