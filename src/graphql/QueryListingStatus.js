import { gql } from "@apollo/client";

export default gql`
  query  GetListingStatus($limit: Int!){
    getListingStatus(input: {limit: $limit}){
      _id
      numlisting
      numlistingOpened
      numListingError
      createdAt
      listingIdWithError{
        _id
        pathListing
      }
    }
  }
`;
