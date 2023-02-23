import { gql } from "@apollo/client";

export default gql`
  query GetEmailsNotificationsRequest(
    $offset: Int!
    $limit: Int!
    $sortBy: QueryEmailsNotificationsRequestWithCriteriumSortBy
    $filterBy: [QueryEmailsNotificationsRequestWithCriteriumFilterBy]
    $filterByOr: [QueryEmailsNotificationsRequestWithCriteriumFilterByOr]
  ) {
    getEmailsNotificationsRequestWithCriteria(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy, filterByOr: $filterByOr }) {
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
