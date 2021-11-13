import React, { useRef } from "react";
import classes from "../../styles/MessageForm/HomeForm.module.scss";
import UploadImg from "../svg/UploadImg";

import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

const HomeForm = (props) => {
  const { handleSubmit, text, setText, setImg, channel, AutoLink } = props;
  const inputRef = useRef(null);

  const handleDown = (e) => {
    if (e.keyCode == 13 && e.ctrlKey) {
      document.getElementById("submit").click();
      return;
    }
};



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
          <div className={classes.input_container}>
            <TextField
              multiline
              id='js-text'
              maxRows={3}
              placeholder={`＃${channel && channel.name}へのメッセージを作成`}
              ref={inputRef}
              className={classes.input}
              onKeyDown={handleDown}
              value={text}
              name="textarea"
              onChange={(e) => setText(e.target.value)}
            />
            <input type="submit" id="submit" style={{ display: "none" }} 
            onClick={AutoLink}
            />
          </div>
          <div className={classes.wrapper}>
            <button type="submit" className={classes.button_container}>
              <SendIcon color="primary" className={classes.sendButton} />
            </button>
          </div>
        </form>
        <small className={classes.subText}>Enterで改行</small>
              <small className={classes.subText2}>Ctrl+Enterで送信</small>
      </div>
    </>
  );
};

export default HomeForm;
