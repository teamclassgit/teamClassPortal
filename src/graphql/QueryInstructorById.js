import { gql } from "@apollo/client";

export default gql`
  query getInstructorById($instructorId: String!) {
    instructor(query: { _id: $instructorId }) {
      _id
      availability {
        dayOfWeek
        fromHour
        fromMinutes
        increment
        toHour
        toMinutes
      }
      billingAddresses {
        addressLine1
        addressLine2
        city
        company
        country
        default
        email
        name
        phone
        state
        zip
      }
      company
      createdAt
      dateOverrides {
        dates
        teamClassIds
        times {
          fromHour
          fromMinutes
          toHour
          toMinutes
        }
      }
      email
      name
      phone
      stripeConnect {
        accountId
        createdAt
        failedMessage
        onboardingDeadline
        onboardingURL
        status
        updatedAt
      }
      updatedAt
      company
      stripeConnect {
        accountId
        createdAt
        onboardingDeadline
        onboardingURL
        status
        updatedAt
        failedMessage
      }
      billingAddresses {
        addressLine1
        addressLine2
        city
        company
        country
        default
        email
        name
        phone
        state
        zip
      }
    }
  }
`;
