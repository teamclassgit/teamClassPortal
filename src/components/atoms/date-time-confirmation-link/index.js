// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Check } from "react-feather";

const DateTimeConfirmationLink = ({ id }) => (
  <a
    className="mr-1"
    href={`${process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL}/booking/date-time-confirmation/${id}`}
    target={"_blank"}
    rel="noopener noreferrer"
    title={"Approve/Reject link"}
  >
    <Avatar color="light-primary" size="sm" icon={<Check />} />
  </a>
);

export default DateTimeConfirmationLink;