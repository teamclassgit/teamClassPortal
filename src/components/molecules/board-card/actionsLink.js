// @scripts
import BookingStepsEdit from "@atoms/booking-steps";
import CalendarLink from "@atoms/calendar-link";
import DateTimeConfirmationLink from "@atoms/date-time-confirmation-link";
import PaymentLink from "@atoms/payment-link";
import RegistrationLink from "@atoms/registration-link";
import SignupLink from "@atoms/signup-link";

export const actionsLinkStageBookingBoard = (bookingId, handleEdit) => {
  const stages = {
    quote: [
      <CalendarLink id={bookingId}/>,
      <BookingStepsEdit id={bookingId} handleEdit={handleEdit} />
    ],
    requested: [
      <CalendarLink id={bookingId}/>,
      <DateTimeConfirmationLink id={bookingId} />,
      <BookingStepsEdit id={bookingId} handleEdit={handleEdit} />
    ],
    rejected: [
      <CalendarLink id={bookingId}/>,
      <BookingStepsEdit id={bookingId} handleEdit={handleEdit} />
    ],
    accepted: [
      <CalendarLink id={bookingId}/>,
      <SignupLink id={bookingId} />,
      <RegistrationLink id={bookingId} />,
      <PaymentLink id={bookingId} text="Deposit link" color="light-primary"/>,
      <BookingStepsEdit id={bookingId} handleEdit={handleEdit} />
    ],
    deposit: [
      <CalendarLink id={bookingId}/>,
      <SignupLink id={bookingId} />,
      <RegistrationLink id={bookingId} />,
      <PaymentLink id={bookingId} text="Deposit link" color="light-primary"/>,
      <PaymentLink id={bookingId} text="Final payment link" color="secondary"/>,
      <BookingStepsEdit id={bookingId} handleEdit={handleEdit} />
    ],
    paid: [
      <CalendarLink id={bookingId}/>,
      <SignupLink id={bookingId} />,
      <RegistrationLink id={bookingId} />,
      <PaymentLink id={bookingId} text="Deposit link" color="light-primary"/>,
      <PaymentLink id={bookingId} text="Final payment link" color="secondary"/>,
      <BookingStepsEdit id={bookingId} handleEdit={handleEdit} />
    ],
    closed: [<BookingStepsEdit id={bookingId} handleEdit={handleEdit} />]
  };

  return stages;
};
