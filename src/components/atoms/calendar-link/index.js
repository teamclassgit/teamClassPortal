// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Calendar } from "react-feather";

const CalendarLink = ({ id }) => ( 
  <a
    className="mr-1"
    href={`https://www.teamclass.com/customers/select-date-time/${id}`}
    target="_blank"
    rel="noopener noreferrer"
    title="Select date and time link"
  >
    <Avatar color="light-primary" size="sm" icon={<Calendar />} />
  </a>
);

export default CalendarLink;
