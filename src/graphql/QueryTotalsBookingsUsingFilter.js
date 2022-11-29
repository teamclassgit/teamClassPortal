import { gql } from "@apollo/client";

export default gql`
  query queryGetTotalsUsingFilter ($filterBy: [QueryWithCriteriumFilterBy!]) {
    totals: getBookingsWithCriteria(input: { totalsOnly: true, filterBy: $filterBy }) {
      count
      total
      rows {
        _id
      }
    }
  }`;