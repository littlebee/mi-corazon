import React from "react";

export function LiveVideo({ className }) {
  return (
    <img
      className={className}
      src="http://buster2.local/video_feed"
      alt="live video feed"
    />
  );
}

export default LiveVideo;
