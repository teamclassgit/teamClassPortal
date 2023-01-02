// @packages
import React from "react";
import Avatar from "@components/avatar";
import PropTypes from "prop-types";

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

BookingActionLink.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.object,
  link: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func
};
