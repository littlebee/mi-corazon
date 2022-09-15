import React, { useState, useEffect } from "react";
import classnames from "classnames";

import EnlargingText from "./EnlargingText";

import st from "./TimedProgress.module.css";

export function TimedProgress({ message, seconds }) {
  // ticks are 1/10 sec
  const [tick, setTick] = useState(0);
  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setHasRendered(true);
    });

    let _tick = 0;
    const interval = setInterval(() => {
      _tick = _tick + 1;
      setTick(_tick);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const remaining = (seconds - tick / 10).toFixed(1);
  const pctComplete = (1 - remaining / seconds) * 100;
  if (remaining <= 0) {
    return null;
  }
  const outerClass = classnames(st.timedProgress, hasRendered && st.shown);
  const innerBarStyle = {
    width: `${pctComplete}%`,
  };
  return (
    <div className={outerClass}>
      <div className={st.message}>{message}</div>
      <div
        className={st.subtext}
      >{`This will take about ${seconds} seconds`}</div>
      <div className={st.outerBar}>
        <div className={st.innerBar} style={innerBarStyle} />
      </div>
    </div>
  );
}

export default TimedProgress;
