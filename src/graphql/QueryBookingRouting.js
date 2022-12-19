import { gql } from "@apollo/client";

export default gql`
  query  GetBookingRouting($name: String!){
    bookingRouting(query: {name: $name}){
      _id
      eventCoordinators
      name
    }  
  }
`;
