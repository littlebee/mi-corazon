import React, { useState, useEffect } from "react";
import classnames from "classnames";

import st from "./EnlargingText.module.css";

export function EnlargingText({ size, className, children }) {
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    setHasUpdated(true);
  }, []);

  const style = hasUpdated
    ? {
        fontSize: size,
      }
    : {};
  return (
    <div className={classnames(st.enlargingText, className)} style={style}>
      {children}
    </div>
  );
}

export default EnlargingText;
