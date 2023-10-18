import { gql } from "@apollo/client";

export default gql`
  mutation updateSentDocumentForSystemStatus (
    $input: InputUpdateSentDocumentForSystemStatus!
  ) {
    updateSentDocumentForSystemStatus(input: $input) {
      success
      message
    }
  }
`;
