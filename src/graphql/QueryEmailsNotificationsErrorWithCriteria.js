import { gql } from "@apollo/client";

export default gql`
  query GetEmailsNotificationsError(
    $offset: Int!
    $limit: Int!
    $sortBy: QueryEmailsNotificationsErrorWithCriteriumSortBy
    $filterBy: [QueryEmailsNotificationsErrorWithCriteriumFilterBy]
    $filterByOr: [QueryEmailsNotificationsErrorWithCriteriumFilterByOr]
  ) {
    getEmailsNotificationsErrorWithCriteria(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy, filterByOr: $filterByOr }) {
      count
      rows {
        _id
        subject
        from {
          email
          name
        }
        to {
          email
          name
          type
        }
        templateId
        status
        log
        mergeVariables {
          name
          content
        }
        documentId
        collection
        functions
        origin
        type
        isTask
        createAt
      }
    }
  }
`;
