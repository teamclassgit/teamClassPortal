import { gql } from "@apollo/client";

export default gql`
  query ExampleQuery($query: AttendeeQueryInput, $limit: Int, $sortBy: AttendeeSortByInput) {
    attendees(query: $query, limit: $limit, sortBy: $sortBy) {
      zip
      updatedAt
      statusNotes
      status
      state
      phone
      name
      lateRegistrationAnswerDate
      kitFullFitment {
        shipmentTrackingNumber
        fullfitmentDate
        fullfitmentBy
        carrier
      }
      instructorOrDistributorId
      email
      dietaryRestrictions
      createdAt
      country
      city
      canDeliverKitReason
      canDeliverKit
      bookingId
      addressLine2
      addressLine1
      additionalFields {
        value
        order
        name
      }
      additionalCost
      _id
    }
  }
`;


// "query": {
//   "status_ne": "confirmed"
// },
