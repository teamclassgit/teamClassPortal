// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Video } from "react-feather";

const MeetingLink = ({ color, href, title }) => (
  <a
    className="mr-1"
    href={href ?? "#" }
    title={title}
    target={"_blank"}
    rel="noopener noreferrer"
    onClick={(e) => !href && e.preventDefault()}
  >
    <Avatar color={color} size="sm" icon={<Video size={18} />} />
  </a>
);

export default MeetingLink;