import { gql } from "@apollo/client";

export default gql`
  mutation updateClassListinPrices($id: String!, $variants: [TeamClassVariantUpdateInput!]) {
    updateOneTeamClass(query: { _id: $id }, set: { variants: $variants }) {
      _id
      variants {
        active
        duration
        groupEvent
        hasKit
        instructorFlatFee
        kitHasAlcohol
        maximum
        minimum
        notes
        order
        pricePerson
        pricePersonInstructor
        expectedProfit
        priceTiers {
          maximum
          minimum
          price
          priceInstructor
        }
        registrationFields {
          active
          label
          listItems
          name
          order
          placeholder
          required
          type
        }
        title
      }
    }
  }
`;