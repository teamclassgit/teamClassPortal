import { gql } from "@apollo/client";

export default gql`
  query queryGetTotalsEmailsNotificationsRequestUsingFilter ($filterBy: [QueryEmailsNotificationsRequestWithCriteriumFilterBy!]) {
    totals: getEmailsNotificationsRequestWithCriteria(input: { totalsOnly: true, filterBy: $filterBy }) {
      count
      rows {
        _id
      }
    }
  }`;