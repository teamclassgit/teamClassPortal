import { gql } from "@apollo/client";

export default gql`
  query  GetSystemStatus($limit: Int!){
    getSystemStatus(input: {limit: $limit}){
      status
      resultBookingFull{
        hasError
        status
      }
      resultListing{
        hasError
        status
      }
      resultBooking{
        hasError
        status
      }
    }
  }
`;
