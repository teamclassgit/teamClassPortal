import { gql } from "@apollo/client";

export default gql`
  mutation deleteEventCoordinator($id: String!) {
    deleteOneEventCoordinator(query: { _id: $id }) {
      _id
    }
  }
`;
