import { gql } from '@apollo/client';

export default gql`
query getConversationsDetails ($bookingsIds: [String!]) {
  getConversationsDetails (input : {bookingsIds : $bookingsIds}) {
     _id
     createdAt
     status
     customer {
       name
       email
     }
     classTitle
     classOption   
     coordinator {
       name
       email
     }
     attendees
     calendarEvent {
      day
      month
      year
      fromHour
      fromMinutes
      status
    }
  }
}
`;