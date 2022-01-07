import { gql } from '@apollo/client';

export default gql`
  query GetBookings($offset: Int!, $limit: Int!) {
    getBookingsWithCriteria(input: { offset: $offset, limit: $limit }) {
      updatedAt
      id
      teamClassId
      customerName
      attendees
    }
  }
`;
