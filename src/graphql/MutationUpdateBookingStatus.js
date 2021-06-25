import { gql } from '@apollo/client'

export default gql`
  mutation updateBookingStatus($id: ID!, $status: String!) {
    updateBooking(input: { id: $id, status: $status }) {
      id
      status
    }
  }
`
