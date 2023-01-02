import {gql} from "@apollo/client";

export default gql`
mutation updateReviewVisible($id:String!, $visible: Boolean) {
   updateOneReview(query : {_id: $id}, set: {visible: $visible}) {
      _id
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
      attendeeEmail
  }
}`;