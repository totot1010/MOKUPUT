import React from "react";
import classes from "../styles/MessageForm.module.scss";
import UploadImg from "./svg/UploadImg";

import SendIcon from "@mui/icons-material/Send";

const MessageForm = (props) => {
  const {handleSubmit, text, setText} = props
  return (
    <>
      <div className={classes.message_container}>
        <form className={classes.message_form} onSubmit={handleSubmit} >
          <label htmlFor="img">
            <UploadImg />
          </label>
          <input
            type="file"
            id="Img"
            accept="image/*"
            style={{ display: "none" }}
          />
            <input
              type="text"
              placeholder="新しいメッセージを作成"
              className={classes.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <SendIcon color="primary" className={classes.sendButton} />
        </form>
      </div>
    </>
  );
};

export default MessageForm;
