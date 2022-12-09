// @packages
import React from "react";
import Avatar from "@components/avatar";
import { Truck } from "react-feather";

const TruckLink = ({ color, href, title }) => (
  <a
    className="mr-1"
    href={href ?? "#" }
    title={title}
    target={"_blank"}
    rel="noopener noreferrer"
    onClick={(e) => !href && e.preventDefault()}
  >
    <Avatar color={color} size="sm" icon={<Truck size={18} />} />
  </a>
);

export default TruckLink;