import React from "react";
import { Icon } from "@iconify/react";

const Stars = (props) => {
  const starsArray = [];
  for (let i = 1; i <= 5; i++) {
    i <= props.stars
      ? starsArray.push(
        <Icon icon="material-symbols:star" key={i} width="20" className="text-warning"/>
      )
      : starsArray.push(
        <Icon icon="material-symbols:star" key={i} width="20" className="text-gray"/>
      );
  }
  return starsArray;
};

export default Stars;
