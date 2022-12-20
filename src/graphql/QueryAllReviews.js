import { gql } from "@apollo/client";

export default gql`
  query GetReviews($filter: ReviewQueryInput) {
    reviews(limit: 50, query: $filter, sortBy: DATE_DESC) {
      _id
      title
      date
      bookingId 
      classId 
      attendeeId 
      classRating
      kitRating
      nps
      reviewText
      visible
      status
      testimonial
      attendeeEmail
      company
    }
  }
`;
