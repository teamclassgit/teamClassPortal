import { gql } from "@apollo/client";

export default gql `
  mutation InsertEventCoordinator(
    $id: String!
    $default: Boolean!
    $email: String!
    $name: String!
    $phone: String
    $twilioPhone: String
    $calendlyLink: String
  ){
    insertOneEventCoordinator(
      data:{
        _id: $id,
        default: $default,
        email: $email,
        name: $name,
        phone: $phone,
        twilioPhone: $twilioPhone
        calendlyLink: $calendlyLink
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