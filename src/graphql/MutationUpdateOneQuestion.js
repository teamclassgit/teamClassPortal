import { gql } from '@apollo/client';

export default gql`
  mutation updatequestion($id: String!, $eventCoordinatorId: String) {
    updateOneQuestion(
      query: { _id: $id },
      set: { eventCoordinatorId: $eventCoordinatorId }
    ) {
      _id
      name
      email
      phone
      inquiry
      date
      type
      eventCoordinatorId
    }
  }
`;
