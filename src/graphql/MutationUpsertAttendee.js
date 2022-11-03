import { gql } from '@apollo/client';

export default gql`
  mutation createAttendee(
    $id: String!
    $bookingId: String!
    $name: String!
    $email: String
    $phone: String
    $addressLine1: String
    $addressLine2: String
    $city: String
    $state: String
    $zip: String
    $country: String
    $canDeliverKit: Boolean
    $canDeliverKitReason: String
    $additionalFields: [AttendeeAdditionalFieldInsertInput]
    $additionalCost: Float
    $updatedAt: DateTime
    $createdAt: DateTime
    $status: String
    $instructorOrDistributorId: String
    $statusNotes: String
  ) {
    upsertOneAttendee(
      query: { _id: $id }
      data: {
        _id: $id
        bookingId: $bookingId
        name: $name
        email: $email
        phone: $phone
        addressLine1: $addressLine1
        addressLine2: $addressLine2
        city: $city
        state: $state
        zip: $zip
        country: $country
        canDeliverKit: $canDeliverKit
        canDeliverKitReason: $canDeliverKitReason
        additionalFields: $additionalFields
        additionalCost: $additionalCost
        updatedAt: $updatedAt
        createdAt: $createdAt
        status: $status
        instructorOrDistributorId: $instructorOrDistributorId
        statusNotes: $statusNotes
      }
    ) {
      _id
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
      canDeliverKit
      canDeliverKitReason
      additionalFields {
        name
        value
        order
      }
      additionalCost
      updatedAt
      createdAt
      status
      instructorOrDistributorId
      statusNotes
    }
  }
`;
