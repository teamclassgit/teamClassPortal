import { gql } from "@apollo/client";

export default gql`
  query GetMessageInteraction {
    messageInteractions {
      _id
      message
      bookingId
      fromNumber
      toNumber
      from
      to
      fromId
      toId
      read
      date
      fromName
      toName
    }
  }`;
