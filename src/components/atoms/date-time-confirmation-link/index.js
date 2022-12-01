// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Check } from "react-feather";

const DateTimeConfirmationLink = ({ id }) => (
  <a
    className="mr-1"
    href={`https://www.teamclass.com/booking/date-time-confirmation/${id}`}
    target={"_blank"}
    title={"Approve/Reject link"}
  >
    <Avatar color="light-primary" size="sm" icon={<Check />} />
  </a>
);

export default DateTimeConfirmationLink;