// @packages
import { Calendar, Check, DollarSign, Edit2, User, Users } from "react-feather";

// @scripts
import BookingActionLink from "@atoms/booking-action-link";
import { getBookingLinks } from "@utility/Utils";

export const actionsLinkStage = (bookingId, handleEdit) => {
  const stages = {
    quote: [
      <BookingActionLink
        color="light-primary"
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["selectDateAndTime"]}
        title="Select date and time link"
        icon={<Calendar />}
      />,
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ],
    requested: [
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["selectDateAndTime"]}
        color="light-primary"
        title="Select date and time link"
        icon={<Calendar />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["dateTimeConfirmation"]}
        color="light-primary"
        title="Approve/Reject link"
        icon={<Check />}
      />,
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ],
    rejected: [
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["selectDateAndTime"]}
        color="light-primary"
        title="Select date and time link"
        icon={<Calendar />}
      />,
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ],
    accepted: [
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["selectDateAndTime"]}
        color="light-primary"
        title="Select date and time link"
        icon={<Calendar />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["deposit"]}
        color="light-primary"
        title="Deposit link"
        icon={<DollarSign />}
      />,
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ],
    deposit: [
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["selectDateAndTime"]}
        color="light-primary"
        title="Select date and time link"
        icon={<Calendar />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["signUp"]}
        color="light-primary"
        title="Sign-up link"
        icon={<User />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["signUpStatus"]}
        color="light-primary"
        title="Sign-up status"
        icon={<Users />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["finalPayment"]}
        color="secondary"
        title="Final payment link"
        icon={<DollarSign />}
      />,
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ],
    paid: [
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["selectDateAndTime"]}
        color="light-primary"
        title="Select date and time link"
        icon={<Calendar />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["signUp"]}
        color="light-primary"
        title="Sign-up link"
        icon={<User />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["signUpStatus"]}
        color="light-primary"
        title="Sign-up status"
        icon={<Users />}
      />,
      <BookingActionLink
        link={getBookingLinks(bookingId, process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL)["finalPayment"]}
        color="secondary"
        title="Final payment link"
        icon={<DollarSign />}
      />,
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ],
    closed: [
      <BookingActionLink
        color="light-dark"
        title="Time / Attendees / Invoice Builder"
        icon={<Edit2 />}
        onClick={() => handleEdit(bookingId)}
      />
    ]
  };

  return stages;
};
