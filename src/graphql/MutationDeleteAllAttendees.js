import { gql } from "@apollo/client";

export default gql`
  mutation deleteAttendees($ids: [String!]!) {
    deleteManyAttendees(query: { _id_in: $ids }) {
      deletedCount
    }
  }
`;