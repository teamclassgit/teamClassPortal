import { gql } from "@apollo/client";

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
        totalMembershipDiscount
        className
        attendees
        registeredAttendees
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
        instructorId
        instructorTeamMemberEmail
        instructorTeamMemberId
        instructorTeamMemberName
        instructorTeamMemberPhone
        onDemand
        payments {
          amount
          createdAt
          paymentId
          paymentName
          status
          refund {
            createdAt
            refundAmount
            refundId
            refundReasons
          }
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
          flatFeeIncludedInPrice
          pricePersonInstructor
          expectedProfit
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
        addons {
          name
        }
        totalInstructorInvoice
        instructorInvoiceStatus
        totalDistributorInvoice
        distributorInvoiceStatus
        firstTouchChannel
        preEventSurvey {
          submittedAt
          source
        }
      }
    }
  }
`;
