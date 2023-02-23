import { gql } from "@apollo/client";

export default gql`
  query queryGetTotalsEmailsNotificationsDeliveredUsingFilter ($filterBy: [QueryEmailsNotificationsDeliveredWithCriteriumFilterBy!]) {
    totals: getEmailsNotificationsDeliveredWithCriteria(input: { totalsOnly: true, filterBy: $filterBy }) {
      count
      rows {
        _id
      }
    }
  }`;