import React from "react";

export function NewVideo({ className }) {
  return (
    <video
      width="1024"
      height="600"
      className={className}
      alt="current video recorded"
      controls
      autoPlay
    >
      <source
        src={`http://buster2.local/new_video?_cb=${Date.now()}`}
        type="video/mp4"
      />
    </video>
  );
}

export default NewVideo;
