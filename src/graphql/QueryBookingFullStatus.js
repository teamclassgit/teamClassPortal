import { gql } from "@apollo/client";

export default gql`
  query  GetBookingFullStatus($limit: Int!){
    getBookingFullStatus(input: {limit: $limit}){
      hasError
      bookingList{
        _id
        updateBookingFull
        updatedAtBooking
        updatedAtBookingFull
      }
    }
  }
`;
