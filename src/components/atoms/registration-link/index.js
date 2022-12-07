// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Users } from "react-feather";

const RegistrationLink = ({ id }) => (
  <a
    className="mr-1"
    href={`${process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL}/customers/events/${id}?type=registration`}
    target={"_blank"}
    rel="noopener noreferrer"
    title={"Sign-up status"}
  >
    <Avatar color="light-primary" size="sm" icon={<Users />} />
  </a>
);

export default RegistrationLink;