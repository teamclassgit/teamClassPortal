import { gql } from "@apollo/client";

export default gql`
  mutation deleteDistributor($id: String!) {
    deleteOneDistributor(query: { _id: $id }) {
      _id
    }
  }
`;
