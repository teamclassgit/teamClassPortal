import { gql } from '@apollo/client'

export default gql`
  query GetprivateRequests($filter: PrivateClassRequestQueryInput!) {
    privateClassRequests(limit: 1000, query: $filter, sortBy: DATE_DESC) {
      _id
      date
      name
      email
      phone
      dateOption1
      dateOption2
      attendees
      eventCoordinatorId
    }
  }
`
