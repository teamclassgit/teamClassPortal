import { gql } from "@apollo/client";

export default gql `
  mutation UpdateEventCoordinator(
    $id: String!
    $default: Boolean
    $email: String
    $name: String
    $phone: String
    $twilioPhone: String
    $calendlyLink: String
    $largeEvents: Boolean
  ){
    updateOneEventCoordinator(
      query: {_id: $id},
      set:{
        default: $default,
        email: $email,
        name: $name,
        phone: $phone,
        twilioPhone: $twilioPhone
        calendlyLink: $calendlyLink
        largeEvents: $largeEvents
      }
    ){
      _id
      default
      email
      crmId
      name
      largeEvents
      phone
      twilioPhone
      calendlyLink
    }
  }
`;