import { gql } from "@apollo/client";

export default gql`
  mutation updateActiveInstructor($id: String!, $active: Boolean) {
    updateOneInstructor(
      query: {_id: $id},
      set: {active: $active}
    )
      {
        _id
        active
      }
  }
`;
