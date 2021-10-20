import { gql } from "@apollo/client"

export default gql`
  query getEventCoordinator($id: String!) {
    eventCoordinator(query: { _id: $id }) {
      _id
      name
      email
      default
      crmId
    }
  }
`
