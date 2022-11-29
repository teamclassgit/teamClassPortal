import { gql } from "@apollo/client";

export default gql`
  query GetCustomersForChat(
    $offset: Int!
    $limit: Int!
    $sortBy: QueryWithCriteriumSortBy
    $filterBy: [QueryWithCriteriumFilterBy]
    $filterByOr: [QueryWithCriteriumFilterByOr]
  ) {
    getBookingsWithCriteria(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy, filterByOr: $filterByOr }) {
      count
      total
      rows {
        updatedAt
        createdAt
        _id
        classId
        className
        customerId
        customerName
        customerPhone
        customerEmail
        customerCompany
      }
    }
  }
`;
