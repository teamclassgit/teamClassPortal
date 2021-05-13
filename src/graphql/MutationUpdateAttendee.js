import {gql} from "@apollo/client"

export default gql`
mutation updateAttendee(
  $id:ID!,
  $bookingId: ID!, 
  $name: String, 
  $email: String, 
  $phone: String, 
  $addressLine1: String, 
  $addressLine2: String, 
  $city: String, 
  $state: String, 
  $zip: String,
  $country: String, 
  $dietaryRestrictions: String
) {
   updateAttendee(
     input: {
              id: $id,
              bookingId: $bookingId, 
              name: $name
              email: $email, 
              phone: $phone, 
              addressLine1: $addressLine1,
              addressLine2: $addressLine2,
              city: $city,
              state: $state,
              zip: $zip,
              country: $country,
              dietaryRestrictions: $dietaryRestrictions
          }) {
                id
                bookingId
                name
                addressLine1
                addressLine2
                city
                state
                zip
                country
                email
                phone
                dietaryRestrictions
            }
}`