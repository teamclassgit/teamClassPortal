import { gql } from '@apollo/client';

export default gql`
  query GetBookings($offset: Int!, $limit: Int!, $sortBy: QueryWithCriteriumSortBy, $filterBy: [QueryWithCriteriumFilterBy]) {
    getBookingsWithCriteria(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy }) {
      count
      rows {
        updatedAt
        _id
        status
        customerName
        customerPhone
        customerEmail
        customerCompany
        className
        attendees
        eventDateTime
        payments {
          amount
          createdAt
          paymentId
          paymentName
          status
        }
      }
    }
  }
`;
