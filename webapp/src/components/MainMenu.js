import React, { useState, useEffect } from "react";

import RoundButton from "./RoundButton";

import st from "./MainMenu.module.css";

export function MainMenu({ onRecord, onGallery }) {
  return (
    <div className={st.MainMenu}>
      <RoundButton size="large" className={st.recordButton} onClick={onRecord}>
        Record
      </RoundButton>
      <RoundButton
        size="medium"
        className={st.galleryButton}
        onClick={onGallery}
      >
        Gallery
      </RoundButton>
    </div>
  );
}

export default MainMenu;
