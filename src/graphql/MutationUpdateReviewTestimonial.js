import { gql } from "@apollo/client";

export default gql`
mutation updateReviewTestimonial($id: String!, $testimonial: Boolean) {
    updateOneReview(query : {_id: $id}, set: {testimonial: $testimonial}) {
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
