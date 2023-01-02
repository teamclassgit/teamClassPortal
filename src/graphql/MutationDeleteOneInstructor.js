import { gql } from "@apollo/client";

export default gql`
  mutation deleteInstructor($id: String!) {
    deleteOneInstructor(query: { _id: $id }) {
      _id
    }
  }
`;
