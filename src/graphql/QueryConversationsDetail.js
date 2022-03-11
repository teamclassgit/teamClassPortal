import { gql } from '@apollo/client';

export default gql`
  query getConversationsDetails ($bookingIds: [String!], $userId: String!, $searchText: String!, $limit: Int){
    getConversationsDetails (input: {bookingIds: $bookingIds, userId: $userId, searchText: $searchText, limit: $limit}) {
      _id
      createdAt
      status
      customer {
        name
        email
        company
        _id
      }
      classTitle
      classOption   
      coordinator {
        name
        email
      }
      instructor {
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