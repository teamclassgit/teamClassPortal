import { gql } from "@apollo/client";

export default gql`
  query GetBookingStatus(
    $offset: Int!
    $limit: Int!
    $sortBy: QueryBookingStatusSortBy
    $filterBy: [QueryBookingStatusFilterBy]
    $filterByOr:  [QueryBookingStatusFilterByOr]
  ) {
    getBookingStatus(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy, filterByOr: $filterByOr }) {
      count
      rows {
        _id
        documentId
        attendeeId
        operationType
        status
        createdDocument
        sentDocument
        createdAt
        sentDocumentDate
      }
    }
  }
`;
