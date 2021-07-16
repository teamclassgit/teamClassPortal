import {gql} from "@apollo/client"

export default gql`
query ListAttendees($bookingId:String!) {
  attendees(query: {bookingId: $bookingId}, limit: 10000) {
      _id
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
}`
