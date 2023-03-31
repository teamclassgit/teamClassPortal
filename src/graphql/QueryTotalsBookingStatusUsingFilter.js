import { gql } from "@apollo/client";

export default gql`
  query queryGetTotalsBookingStatusUsingFilter ($filterBy: [QueryBookingStatusFilterBy!]) {
    totals: getBookingStatus(input: { totalsOnly: true, filterBy: $filterBy }) {
      count
      rows {
        _id
      }
    }
  }`;