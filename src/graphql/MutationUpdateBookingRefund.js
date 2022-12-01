import { gql } from '@apollo/client';

export default gql`
  mutation updateBookingRefund($bookingId: String!, $payments: [BookingPaymentUpdateInput], $updatedAt: DateTime!) {
    updateOneBooking(query: { _id: $bookingId }, set: { payments: $payments, updatedAt: $updatedAt }) {
      _id
      payments {
        addressLine1
        addressLine2
        amount
        cardBrand
        cardExpMonth
        cardExpYear
        cardLast4
        cardFunding
        cardCountry
        chargeUrl
        city
        country
        createdAt
        email
        livemode
        name
        paymentId
        paymentName
        paymentMethod
        phone
        state
        status
        refund {
          createdAt
          refundAmount
          refundId
          refundReasons
        }
      }
      updatedAt
    }
  }
`;
