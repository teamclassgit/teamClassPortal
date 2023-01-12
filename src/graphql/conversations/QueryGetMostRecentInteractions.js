import { gql } from "@apollo/client";

export default gql`
  query getMostRecentInteractions($coordinatorId: String!) {
    getMostRecentInteractions(input: { coordinatorId: $coordinatorId, count: 100 })
  }
`;
