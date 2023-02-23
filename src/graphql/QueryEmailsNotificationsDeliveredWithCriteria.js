import { gql } from "@apollo/client";

export default gql`
  query GetEmailsNotificationsDelivered(
    $offset: Int!
    $limit: Int!
    $sortBy: QueryEmailsNotificationsDeliveredWithCriteriumSortBy
    $filterBy: [QueryEmailsNotificationsDeliveredWithCriteriumFilterBy]
    $filterByOr:  [QueryEmailsNotificationsDeliveredWithCriteriumFilterByOr]
  ) {
    getEmailsNotificationsDeliveredWithCriteria(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy, filterByOr: $filterByOr }) {
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
