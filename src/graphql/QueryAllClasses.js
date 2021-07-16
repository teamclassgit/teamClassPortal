import { gql } from '@apollo/client'

export default gql`
  query GetClasses($filter: TeamClassQueryInput!) {
    teamClasses(limit: 1000, query: $filter) {
        _id
        title
        instructorId
        instructorName
        duration
        pricePerson
        hasKit
        minimum
        variants {
             title
             notes
             minimum
             duration
             pricePerson
             hasKit
             order
             active
        }
        category
    }
  }
`
