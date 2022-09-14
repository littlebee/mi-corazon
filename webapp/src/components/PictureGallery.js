import React, { useState, useEffect } from "react";

import st from "./PictureGallery.module.css";

export function PictureGallery() {
  const [cacheBreaker, setCacheBreaker] = useState(Date.now());

  useEffect(() => {
    setInterval(() => {
      setCacheBreaker(Date.now());
    }, 7000);
  }, []);

  const imgSrc = `http://buster2.local/picture?_cb=${cacheBreaker}`;

  return (
    <div className={st.pictureGallery}>
      <span className={st.helper}></span>
      <img
        className={st.picture}
        src={imgSrc}
        alt="loving pic of Betsy and Josh"
      />
    </div>
  );
}

export default PictureGallery;
