// @packages
import React from "react";
import Avatar from "@components/avatar";
import { User } from "react-feather";

const SignupLink = ({ id }) => (
  <a
    className="mr-1"
    href={`https://www.teamclass.com/event/${id}`}
    target={"_blank"}
    title={"Sign-up link"}
  >
    <Avatar color="light-primary" size="sm" icon={<User />} />
  </a>
);

export default SignupLink;