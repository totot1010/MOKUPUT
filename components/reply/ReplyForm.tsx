import React, { useState, createRef, useEffect } from "react";
import classes from "../../styles/reply/ReplyMessage.module.scss";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Emoji from "../../emojis/emojisComponent";
import TagFacesIcon from "@mui/icons-material/TagFaces";

interface Props {
  handleSubmit: () => void;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  mainMessage: {
    uid: string;
    name: string;
    isOnline: boolean;
    avatarURL?: string;
    avatarPath?: string;
    age?: number;
    email: string;
    experience?: string;
    useLanguage?: Array<string>;
    willLanguage?: Array<string>;
    createdAt: Date;
  };
}

const ReplyForm: React.FC<Props> = (props) => {
  const { handleSubmit, text, setText, mainMessage } = props;
  const inputRef = createRef<HTMLInputElement>();
  const [showEmojis, setShowEmojis] = useState(false);
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
      <div className={classes.message_container}>
        <form className={classes.message_form} onSubmit={handleSubmit}>
          <div className={classes.emojiIcon_wrapper}>
            <button onClick={handleShowEmojis}>
              <TagFacesIcon color="primary" className={classes.emojiIcon} />
            </button>
          </div>
          <div className={classes.input_container}>
            <TextField
              multiline
              id="js-text"
              autoFocus
              inputRef={inputRef}
              maxRows={3}
              placeholder={`${mainMessage && mainMessage.name}への返信を作成`}
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
      </div>
      <div className={`${classes.emoji} ${!showEmojis && classes.hidden}`}>
        <Emoji pickEmoji={pickEmoji} />
      </div>
    </>
  );
};

export default ReplyForm;
