import React from "react";
import classes from "../../styles/chat/DirectChatForm.module.scss";
import UploadImg from "../svg/UploadImg";

import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

const DirectChatForm = (props) => {
  const { handleSubmit, text, setText, setImg, chatUser } = props;

  //handleSubmitが何回もレンダリングされている。
  const handleDown = (e) => {
    if (e.keyCode == 13 && e.ctrlKey) {
      document.getElementById("submit").click();
      console.log("a");
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
              maxRows={3}
              placeholder="新しいメッセージを作成する"
              className={classes.input}
              onKeyDown={handleDown}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="submit" id="submit" style={{ display: "none" }} />
          </div>
          <div>
            <button type="submit" className={classes.send_wrapper}>
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

export default DirectChatForm;
