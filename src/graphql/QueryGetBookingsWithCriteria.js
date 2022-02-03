import { gql } from '@apollo/client';

export default gql`
  query GetBookings(
    $offset: Int!
    $limit: Int!
    $sortBy: QueryWithCriteriumSortBy
    $filterBy: [QueryWithCriteriumFilterBy]
    $filterByOr: [QueryWithCriteriumFilterByOr]
  ) {
    getBookingsWithCriteria(input: { offset: $offset, limit: $limit, sortBy: $sortBy, filterBy: $filterBy, filterByOr: $filterByOr }) {
      count
      total
      rows {
        updatedAt
        createdAt
        _id
        classId
        status
        customerId
        customerName
        customerPhone
        customerEmail
        customerCompany
        capRegistration
        hasInternationalAttendees
        eventCoordinatorId
        eventCoordinatorName
        eventCoordinatorEmail
        className
        attendees
        eventDateTime
        rescheduleDateTime
        hasInternationalAttendees
        eventDateTimeStatus
        signUpDeadline
        depositsPaid
        finalPaid
        isRush
        taxAmount
        serviceFeeAmount
        cardFeeAmount
        totalInvoice
        balance
        bookingStage
        closedReason
        payments {
          amount
          createdAt
          paymentId
          paymentName
          status
        }
        classVariant {
          active
          duration
          groupEvent
          hasKit
          instructorFlatFee
          kitHasAlcohol
          maximum
          minimum
          notes
          order
          pricePerson
          title
        }
      }
    }
  }
`;
