// @packages
import React from "react";
import Avatar from "@components/avatar";

const BookingActionLink = ({ color, icon, link, title, onClick }) => ( 
  <a
    className="mr-1"
    href={link}
    onClick={(e) => ((!link && !onClick) ? e.preventDefault() : !!onClick && onClick())}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
  >
    <Avatar color={color} size="sm" icon={icon} />
  </a>
);

export default BookingActionLink;
