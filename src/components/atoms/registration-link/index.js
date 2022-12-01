// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Users } from "react-feather";

const RegistrationLink = ({ id }) => (
  <a
    className="mr-1"
    href={`https://www.teamclass.com/customers/events/${id}?type=registration`}
    target={"_blank"}
    title={"Sign-up status"}
  >
    <Avatar color="light-primary" size="sm" icon={<Users />} />
  </a>
);

export default RegistrationLink;