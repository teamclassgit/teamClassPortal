import { gql } from '@apollo/client';

export default gql`
  query GetClasses($filter: TeamClassQueryInput!) {
    teamClasses(limit: 1000, query: $filter) {
      _id
      title
      instructorId
      instructorName
      additionalInstructors
      duration
      pricePerson
      hasKit
      minimum
      distributorId
      variants {
        title
        notes
        minimum
        maximum
        duration
        pricePerson
        pricePersonInstructor
        hasKit
        order
        active
        groupEvent
        instructorFlatFee
        priceTiers {
          maximum
          minimum
          price
          priceInstructor
        }
        registrationFields {
          label
          placeholder
          type
          listItems
          required
          active
          order
        }
      }
      category
    }
  }
`;
