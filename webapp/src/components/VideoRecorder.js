import React, { useState, useEffect } from "react";
import classnames from "classnames";

import * as service from "../lib/service";

import LiveVideo from "./LiveVideo";
import EnlargingText from "./EnlargingText";
import CountDown from "./CountDown";
import Timer from "./Timer";
import NewVideo from "./NewVideo";
import TimedProgress from "./TimedProgress";

import st from "./VideoRecorder.module.css";
import KeepDiscard from "./KeepDiscard";

const MODE_AWESOME = "awesome";
const MODE_POSE = "pose";
const MODE_COUNTDOWN = "countdown";
const MODE_RECORDING = "recording";
const MODE_SAVING = "saving";
const MODE_REVIEW = "reviewing";
const MODE_KEEP_DISCARD = "keep or discard";

const LINEAR_STATE_TRANSITIONS = [
  // tuple of [mode, number of seconds for that mode]
  [MODE_AWESOME, 3],
  [MODE_POSE, 4],
  [MODE_COUNTDOWN, 3],
  [MODE_RECORDING, 20],
  [MODE_SAVING, 20],
  [MODE_REVIEW, 20],
  [MODE_KEEP_DISCARD, 20],
];

let interval = null; // only one timer running at a time for this component

export function VideoRecorder({ onComplete }) {
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    if (interval) {
      // already created
      return;
    }
    let _modeIndex = 0;
    let tick = 0;
    let lastChangeTick = 0;

    interval = setInterval(async () => {
      const [currentMode, duration] = LINEAR_STATE_TRANSITIONS[_modeIndex];

      const nextMode = () => {
        lastChangeTick = tick;
        _modeIndex += 1;
        setModeIndex(_modeIndex);
      };

      if (currentMode === MODE_SAVING) {
        const isNewVideoReady = await service.isNewVideoReady();
        if (isNewVideoReady) {
          nextMode();
        }
      } else {
        tick += 1;
        if (tick > lastChangeTick + duration) {
          if (_modeIndex + 1 >= LINEAR_STATE_TRANSITIONS.length) {
            clearInterval(interval);
            interval = null;
            return;
          }
          nextMode();
          // we are transitioning to Recording mode.  tell service roll camera!
          if (currentMode === MODE_COUNTDOWN) {
            service.recordVideo();
          }
        }
      }
    }, 1000);
  }, []);

  const handleKeep = () => {
    service.saveNewVideo();
    onComplete();
  };

  const handleDiscard = () => {
    // next video recorded will just overwrite
    onComplete();
  };

  const [mode] = LINEAR_STATE_TRANSITIONS[modeIndex];
  const awesomeClass = classnames(
    st.awesome,
    mode === MODE_AWESOME && st.shown
  );

  const poseClass = classnames(st.pose, mode === MODE_POSE && st.shown);

  return (
    <div className={st.videoRecorder}>
      {[MODE_POSE, MODE_COUNTDOWN, MODE_RECORDING].includes(mode) && (
        <LiveVideo
          className={
            mode === MODE_RECORDING ? st.fullLiveVideo : st.smallLiveVideo
          }
        />
      )}

      {mode === MODE_COUNTDOWN && <CountDown from={3} />}

      {mode === MODE_RECORDING && <Timer seconds={20} showTenths showMinutes />}

      {mode === MODE_SAVING && (
        <TimedProgress seconds={60} message="Encoding Video" />
      )}

      {[MODE_REVIEW, MODE_KEEP_DISCARD].includes(mode) && <NewVideo />}

      {mode === MODE_KEEP_DISCARD && (
        <KeepDiscard
          seconds={LINEAR_STATE_TRANSITIONS[modeIndex][1]}
          onKeep={handleKeep}
          onDiscard={handleDiscard}
        />
      )}

      <div className={awesomeClass}>
        <EnlargingText size={100} className={st.awesomeTitle}>
          Awesome!
        </EnlargingText>
        <EnlargingText size={50} className={st.awesomeSubtitle}>
          Let's record a 20 second video
        </EnlargingText>
      </div>

      <div className={poseClass}>
        <div className={classnames(st.poseText, st.poseTopText)}>
          Move until you are in the frame....
        </div>
        <div className={classnames(st.poseText, st.poseBottomText)}>
          ...and speak up so they can hear you
        </div>
      </div>
    </div>
  );
}

export default VideoRecorder;
