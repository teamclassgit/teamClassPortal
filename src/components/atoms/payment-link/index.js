// @packages
import React from "react";
import Avatar from "@components/avatar";
import { DollarSign } from "react-feather";

const PaymentLink = ({ id, text, color }) => (
  <a
    className="mr-1"
    href={`https://www.teamclass.com/customers/events/${id}?type=payment`}
    target={"_blank"}
    rel="noopener noreferrer"
    title={text}
  >
    <Avatar color={color} size="sm" icon={<DollarSign />} />
  </a>
);

export default PaymentLink;