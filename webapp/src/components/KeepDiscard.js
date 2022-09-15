import React, { useEffect, useState } from "react";
import classnames from "classnames";

import RoundButton from "./RoundButton";
import Timer from "./Timer";

import st from "./KeepDiscard.module.css";

const MODE_DIALOG = "dialog";
const MODE_THANKS = "thanks";

export function KeepDiscard({ onDiscard, onKeep }) {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(MODE_DIALOG);
  }, []);

  const handleKeep = () => {
    setMode(MODE_THANKS);
    setTimeout(() => onKeep(), 10000);
  };

  return (
    <div className={st.keepDiscard}>
      <div className={classnames(mode === MODE_DIALOG && st.shown, st.dialog)}>
        <div className={st.titleText}>They're going to love it!</div>
        <div className={st.buttons}>
          <RoundButton
            className={st.discardButton}
            size="medium"
            onClick={onDiscard}
          >
            Discard
          </RoundButton>

          {/* <RoundButton className={st.recordButton} size="medium" onClick={onRecord}>
          Rerecord
        </RoundButton> */}

          <RoundButton
            className={st.keepButton}
            size="large"
            onClick={handleKeep}
          >
            Keep it!
            <div className={st.autosaveText}>
              <span>Autokeep in</span>
              <Timer
                className={st.timer}
                seconds={2000}
                onExpire={handleKeep}
              />
            </div>
          </RoundButton>
        </div>
      </div>
      <div className={classnames(mode === MODE_THANKS && st.shown, st.thanks)}>
        <div className={st.titleText}>Thank you for another happy memory!</div>
      </div>
    </div>
  );
}

export default KeepDiscard;
