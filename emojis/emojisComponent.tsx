import React from "react";
import { EmojiPickerContainer, EmojisContainer } from "./emojisStyles";

const Emojis = ({ pickEmoji }) => {
  return (
    <EmojisContainer>
      {<EmojiPickerContainer onEmojiClick={pickEmoji} />}
    </EmojisContainer>
  );
};

export default Emojis;
