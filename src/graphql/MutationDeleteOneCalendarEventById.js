import { gql } from "@apollo/client";

export default gql`
  mutation deleteCalendarEvent($bookingId: String!) {
    deleteOneCalendarEvent(query: { bookingId: $bookingId }) {
      _id
    }
  }
`;
