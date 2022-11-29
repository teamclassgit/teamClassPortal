import { gql } from "@apollo/client";

export default gql`
  mutation updateClassListingTitle($id: String!, $title: String) {
    updateOneTeamClass(query: { _id: $id }, set: { title: $title }) {
      _id
      title
    }
  }
`;
