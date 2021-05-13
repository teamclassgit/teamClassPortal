import {gql} from "@apollo/client"

export default gql`
query ListAttendees($bookingId:ID!) {
  listAttendees(filter: {bookingId: {eq: $bookingId}}, limit: 10000) {
    items {
      id
      bookingId
      name
      addressLine1
      addressLine2
      city
      state
      zip
      country
      email
      phone
      dietaryRestrictions
    }
  }
}`
