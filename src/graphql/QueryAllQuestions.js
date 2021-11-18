import { gql } from '@apollo/client';

export default gql`
  query GetAllQuestions($filter: QuestionQueryInput!) {
    questions(limit: 1000, query: $filter, sortBy: DATE_DESC) {
      _id
      date
      inquiry
      email
      phone
      name
      type
    }
  }
`;
