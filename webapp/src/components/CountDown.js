import React, { useState, useEffect } from "react";
import classnames from "classnames";

import EnlargingText from "./EnlargingText";

import st from "./CountDown.module.css";

export function CountDown({ from }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let _tick = 0;
    const interval = setInterval(() => {
      _tick = _tick + 1;
      setTick(_tick);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = from - tick;
  return remaining === 0 ? null : (
    <div className={st.countdown}>
      <EnlargingText className={st.text} size={400}>
        {remaining}
      </EnlargingText>
    </div>
  );
}

export default CountDown;
