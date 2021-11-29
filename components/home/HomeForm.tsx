import React, { useState, useEffect, createRef } from "react";
import classes from "../../styles/home/HomeForm.module.scss";
import UploadImg from "../svg/UploadImg";

import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Emoji from "../../emojis/emojisComponent";
import TagFacesIcon from "@mui/icons-material/TagFaces";

interface Props {
  handleSubmit: (e) => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setImg: React.Dispatch<React.SetStateAction<any>>;
  channel: {
    id: string;
    name: string;
  };
}

const HomeForm: React.FC<Props> = (props) => {
  const { handleSubmit, text, setText, setImg, channel } = props;
  const inputRef = createRef<HTMLInputElement>();
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<number>();

  const handleDown = (e) => {
    if (e.keyCode == 13 && e.ctrlKey) {
      document.getElementById("submit").click();
      return;
    }
  };

  const pickEmoji = (e, { emoji }) => {
    const ref = inputRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const message = start + emoji + end;
    setText(message);
    setCursorPosition(start.length + emoji.length);
  };

  const handleShowEmojis = (e) => {
    e.preventDefault();
    inputRef.current.focus();

    setShowEmojis(!showEmojis);
  };

  useEffect(() => {
    inputRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  return (
    <>
      <div className={classes.message_form_container}>
        <form className={classes.message_form} onSubmit={handleSubmit}>
          <div className={classes.image_container}>
            <label htmlFor="img">
              <UploadImg />
            </label>
            <input
              onChange={(e) => setImg(e.target.files[0])}
              type="file"
              id="img"
              accept="image/*"
              style={{ display: "none" }}
            />
          </div>
          <div className={classes.emojiIcon_wrapper}>
            <TagFacesIcon
              color="primary"
              className={classes.emojiIcon}
              onClick={handleShowEmojis}
            />
          </div>
          <div>
            <TextField
              multiline
              id="js-text"
              autoFocus
              inputRef={inputRef}
              maxRows={3}
              placeholder={`${channel && channel.name}へのメッセージを作成`}
              className={classes.input_text}
              onKeyDown={handleDown}
              value={text}
              name="textarea"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              id="submit"
              className={classes.button_container}
            >
              <SendIcon color="primary" className={classes.sendButton} />
            </button>
          </div>
        </form>
        <small className={classes.subText}>Enterで改行</small>
        <small className={classes.subText2}>Ctrl+Enterで送信</small>
      </div>
      <div
        className={`${classes.emoji_container} ${
          !showEmojis && classes.emoji_hidden
        }`}
      >
        <Emoji pickEmoji={pickEmoji} />
      </div>
    </>
  );
};

export default HomeForm;
