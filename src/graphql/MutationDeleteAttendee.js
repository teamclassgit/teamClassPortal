import {gql} from "@apollo/client"

export default gql`
mutation deleteAttendee($id:ID!) {
   deleteAttendee(
     input: {
              id: $id
          }) {
                id
            }
}`