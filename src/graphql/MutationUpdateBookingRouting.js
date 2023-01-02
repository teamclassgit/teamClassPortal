import {gql} from "@apollo/client";

export default gql`
mutation updateBookingRouting($eventCoordinators: [String!], $name: String) {
    updateOneBookingRouting(query: {name: $name}, set: {eventCoordinators: $eventCoordinators}) {
        _id
        eventCoordinators
        name
    }
}`;