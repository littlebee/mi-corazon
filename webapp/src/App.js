import React, { useState, useRef, useEffect } from "react";

import "./App.css";
import MainMenu from "./components/MainMenu";

import { PictureGallery } from "./components/PictureGallery";
import { VideoRecorder } from "./components/VideoRecorder";

const SLEEP_TIMEOUT = 30000;

const MODE_GALLERY = "gallery";
const MODE_MENU = "menu";
const MODE_RECORD = "record";

function App() {
  const [mode, setMode] = useState(MODE_GALLERY);
  const mouseHoldInterval = useRef(null);
  const sleepTimeout = useRef(null);

  useEffect(() => {
    if (["menu, record"].includes(mode)) {
      sleepTimeout.current = setTimeout(() => {
        setMode(MODE_GALLERY);
      }, SLEEP_TIMEOUT);
    } else {
      sleepTimeout?.current && clearTimeout(sleepTimeout.current);
    }
  }, [mode]);

  const handleInGalleryClick = () => {
    setMode(MODE_MENU);
  };

  const handleGallery = () => {
    setMode(MODE_GALLERY);
  };

  const handleRecord = () => {
    setMode(MODE_RECORD);
  };

  const handleRecordComplete = () => {
    setMode(MODE_GALLERY);
  };

  // a simple, universal way to get the app to reload
  // hold down for 10 seconds anywhere on the screen
  const handleTouchStart = () => {
    console.log("got touch start");
    mouseHoldInterval.current = setTimeout(() => {
      console.log("reloading document");
      document.location.reload();
    }, 10000);
  };

  const handleTouchEnd = () => {
    clearTimeout(mouseHoldInterval.current);
  };

  return (
    <div
      className="App"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {mode === MODE_GALLERY && (
        <PictureGallery onClick={handleInGalleryClick} />
      )}
      {mode === MODE_MENU && (
        <MainMenu onRecord={handleRecord} onGallery={handleGallery} />
      )}
      {mode === MODE_RECORD && (
        <VideoRecorder onComplete={handleRecordComplete} />
      )}
    </div>
  );
}

export default App;
