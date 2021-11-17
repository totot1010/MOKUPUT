import React, { useState, useRef, useEffect, createRef } from "react";
import classes from "../../styles/home/HomeForm.module.scss";
import UploadImg from "../svg/UploadImg";

import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Emoji from "../../emojis/emojisComponent";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const HomeForm = (props) => {
  const { handleSubmit, text, setText, setImg, channel } = props;
  const inputRef = createRef();
  const [showEmojis, setShowEmojis] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();

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
      <div className={classes.message_container}>
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
          <div className={classes.input_container}>
            <TextField
              multiline
              id="js-text"
              autoFocus
              inputRef={inputRef}
              maxRows={3}
              placeholder={`${channel && channel.name}へのメッセージを作成`}
              className={classes.input}
              onKeyDown={handleDown}
              value={text}
              name="textarea"
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className={classes.button_wrapper}>
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
      <div className={`${classes.emoji} ${!showEmojis && classes.hidden}`}>
        <Emoji pickEmoji={pickEmoji} />
      </div>
    </>
  );
};

export default HomeForm;
