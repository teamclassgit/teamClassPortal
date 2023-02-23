import { gql } from "@apollo/client";

export default gql`
  query queryGetTotalsEmailsNotificationsErrorUsingFilter ($filterBy: [QueryEmailsNotificationsErrorWithCriteriumFilterBy!]) {
    totals: getEmailsNotificationsErrorWithCriteria(input: { totalsOnly: true, filterBy: $filterBy }) {
      count
      rows {
        _id
      }
    }
  }`;