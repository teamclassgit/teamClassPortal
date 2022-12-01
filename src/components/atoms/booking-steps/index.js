// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Edit2 } from "react-feather";

const BookingStepsEdit = ({id, handleEdit}) => (
  <a
    className="mr-1"
    onClick={() => handleEdit(id)}
    target={"_blank"}
    rel="noopener noreferrer"
    title={"Time / Attendees / Invoice Builder"}
  >
    <Avatar color="light-dark" size="sm" icon={<Edit2 />} />
  </a>
);


export default BookingStepsEdit;