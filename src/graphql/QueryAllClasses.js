import {gql} from "@apollo/client"

export default gql`
query GetClasses($filter:TableTeamClassFilterInput!) {
  listTeamClasses(limit: 1000,filter: $filter) {
    items {
      id
      title
      category
    }
  }
}`
