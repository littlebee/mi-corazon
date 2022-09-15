import React, { useState, useEffect } from "react";
import classnames from "classnames";

import st from "./Timer.module.css";

let interval;

export function Timer({
  className,
  seconds,
  showTenths,
  showMinutes,
  onExpire,
}) {
  // ticks are 1/10 sec
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let _tick = 0;
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      _tick = _tick + 1;
      setTick(_tick);
      if (_tick / 10 > seconds) {
        clearInterval(interval);
        onExpire && onExpire();
      }
    }, 100);
  }, [onExpire, seconds]);

  let remaining = (seconds - tick / 10).toFixed(showTenths ? 1 : 0);
  if (remaining < 0) {
    return null;
  }

  return (
    <div className={classnames(st.timer, className)}>
      {showMinutes && "0:"}
      {remaining}
    </div>
  );
}

export default Timer;
