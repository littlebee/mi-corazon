import React, { useState, useEffect } from "react";
import classnames from "classnames";

import st from "./RoundButton.module.css";

export function RoundButton({ size, className, onClick, children }) {
  let sizeClass = st.small;
  if (size === "medium") {
    sizeClass = st.medium;
  } else if (size === "large") {
    sizeClass = st.large;
  }

  const cls = classnames(st.roundButton, className, sizeClass);

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export default RoundButton;
