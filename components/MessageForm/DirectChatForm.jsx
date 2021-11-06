import React from "react";
import classes from "../../styles/MessageForm/DirectChatForm.module.scss";
import UploadImg from "../svg/UploadImg";

import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";

const DirectChatForm = (props) => {
  const { handleSubmit, text, setText, setImg } = props;
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
            <input
              type="text"
              placeholder="新しいメッセージを作成"
              className={classes.input}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div>
            <Button type='submit' className={classes.sendButtonWrapper}>
              <SendIcon color="primary" className={classes.sendButton} />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default DirectChatForm;