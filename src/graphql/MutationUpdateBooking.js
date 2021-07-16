import {gql} from '@apollo/client'

export default gql`
  mutation updateBooking(
    $bookingId: String!
    $customerId: String!
    $name: String!
    $phone: String!
    $email: String
    $company: String
    $updatedAt: DateTime!
    $attendees: Int!
    $instructorId: String!
    $instructorName: String!
    $pricePerson: Float!
    $classMinimum: Int!
    $teamClassId: String!
    $duration: Float!
  ) {
        updateOneCustomer(query: { _id: $customerId }, set: { name: $name, phone: $phone, email: $email, company: $company, updatedAt: $updatedAt }) {
          _id
          name
          email
          phone
          company
          createdAt
          updatedAt
        }
        updateOneBooking(
          query: { _id: $bookingId }
          set: {
            customerName: $name
            updatedAt: $updatedAt
            attendees: $attendees
            classMinimum: $classMinimum
            pricePerson: $pricePerson
            teamClassId: $teamClassId
            instructorId: $instructorId
            instructorName: $instructorName
            eventDurationHours: $duration
          }
        ) {
          _id
          date
          expirationHours
          teamClassId
          instructorId
          instructorName
          customerId
          customerName
          eventDate
          eventDurationHours
          attendees
          classMinimum
          pricePerson
          serviceFee
          salesTax
          discount
          status
          rushFee
          createdAt
          updatedAt
        }
  }
`
