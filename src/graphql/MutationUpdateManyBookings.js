import { gql } from "@apollo/client";

export default gql`
  mutation updateManyBookings($set: BookingUpdateInput!, $query: BookingQueryInput) {
    updateManyBookings(set: $set, query: $query) {
      matchedCount
      modifiedCount
    }
  }
`;
