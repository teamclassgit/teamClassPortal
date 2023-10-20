import { gql } from "@apollo/client";

export default gql`
  mutation updateSignUpPageSettings($id: String!, $signUpPageSettings: BookingSignUpPageSettingUpdateInput!, $updatedAt: DateTime!) {
    updateOneBooking(query: { _id: $id }, set: { signUpPageSettings: $signUpPageSettings, updatedAt: $updatedAt }) {
      _id
      teamClassId
      customerId
      customerName
      attendees
      classMinimum
      eventDurationHours
      eventCoordinatorId
      pricePerson
      serviceFee
      salesTax
      rushFee
      discount
      status
      closedReason
      eventLink
      signUpStatusLink
      checkoutLink
      taxExempt
      onDemand
      payments {
        amount
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
      notes {
        note
        author
        date
        shared
      }
      classVariant {
        title
        minimum
        maximum
        pricePerson
        hasKit
        groupEvent
        instructorFlatFee
        flatFeeIncludedInPrice
        pricePersonInstructor
        expectedProfit
        registrationFields {
          label
          placeholder
          type
          listItems
          required
          active
          order
        }
      }
      createdAt
      updatedAt
      signUpDeadline
      signUpPageSettings {
        invitationFrom
        additionalCopyToShow
        optionalAddressCopy
        additionalRegistrationFields {
          label
          placeholder
          type
          listItems
          required
          active
          order
        }
      }
    }
  }
`;
