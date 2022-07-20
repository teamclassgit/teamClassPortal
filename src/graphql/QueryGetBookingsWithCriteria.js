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
        timezone
        timezoneLabel
        depositsPaid
        finalPaid
        depositPaidDate
        finalPaymentPaidDate
        isRush
        taxAmount
        serviceFeeAmount
        cardFeeAmount
        totalInvoice
        balance
        salesTax
        salesTaxState
        taxExempt
        discount
        bookingStage
        closedReason
        bookingTags
        customerTags
        gclid
        instantBooking
        utm_campaign
        utm_source
        utm_medium
        utm_content
        utm_term
        payments {
          amount
          createdAt
          paymentId
          paymentName
          status
        }
        preEventSurvey {
          submittedAt
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
        shippingTrackingLink
        joinInfo {
          eventId
          joinUrl
          manualLink
          password
        }
        totalInstructorInvoice
        instructorInvoiceStatus
        totalDistributorInvoice
        distributorInvoiceStatus
        preEventSurvey {
          submittedAt
          source
        }
      }
    }
  }
`;
