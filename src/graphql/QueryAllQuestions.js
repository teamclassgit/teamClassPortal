import { gql } from '@apollo/client';

export default gql`
  query GetAllQuestions($filter: QuestionQueryInput!, $limit: Int!) {
    questions(limit: $limit, query: $filter, sortBy: DATE_DESC) {
      _id
      date
      inquiry
      email
      phone
      name
      type
      eventCoordinatorId
    }
  }
`;
