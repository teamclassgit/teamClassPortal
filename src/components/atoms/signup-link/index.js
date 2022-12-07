// @packages
import React from "react";
import Avatar from "@components/avatar";
import { User } from "react-feather";

const SignupLink = ({ id }) => (
  <a
    className="mr-1"
    href={`${process.env.REACT_APP_PUBLIC_MAIN_WEBSITE_URL}/event/${id}`}
    target={"_blank"}
    rel="noopener noreferrer"
    title={"Sign-up link"}
  >
    <Avatar color="light-primary" size="sm" icon={<User />} />
  </a>
);

export default SignupLink;