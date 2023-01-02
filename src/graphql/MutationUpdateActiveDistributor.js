import { gql } from "@apollo/client";

export default gql`
  mutation updateActiveDistributor($id: String!, $active: Boolean) {
    updateOneDistributor(
      query: {_id: $id},
      set: {active: $active}
    )
      {
        _id
        active
      }
  }
`;
