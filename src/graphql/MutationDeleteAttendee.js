import {gql} from "@apollo/client";

export default gql`
mutation deleteAttendee($id:String!) {
   deleteOneAttendee(query: {_id: $id}) { _id }
}`;