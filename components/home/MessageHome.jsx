import React, { useEffect, useRef, useState, createRef } from "react";
import anchorme from "anchorme";
import { db, auth } from "../../firebase/firebase";
import { filterXSS } from "xss";
import { useRouter } from "next/router";
import Emoji from "../../emojis/emojisComponent";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import classes from "../../styles/home/Homebody.module.scss";
import Avatar from "@mui/material/Avatar";
import UserDetailModal from "../organism/user/UserDetailModal";
import { useAllUsers } from "../../hooks/useAllUsers";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const MessageHome = (props) => {
  const { message } = props;
  const scrollRef = useRef();
  const editRef = createRef();
  const [showEmojis, setShowEmojis] = useState(false);
  const [openIcon, setOpenIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState(message.text);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const channelId = router.query.channelId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behaivor: "smooth", block: "end" });
  }, [message.image, message.text]);

  const pickEmoji = (e, { emoji }) => {
    const ref = editRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const message = start + emoji + end;
    setText(message);
    setShowEmojis(!showEmojis);
  };

  const handleShowEmojis = (e) => {
    e.preventDefault();
    editRef.current.focus();

    setShowEmojis(!showEmojis);
  };

  const handleModalClose = () => setOpenIcon(false);

  //テキストに含まれているURLの文字列をaタグに変換
  const htmlText = anchorme({
    input: message.text,
    options: {
      //https://がついていないリンクも変換してくれる
      exclude: (string) => {
        if (!string.startsWith("https://")) {
          return true;
        } else {
          return false;
        }
      },
      attributes: () => {
        const attributes = {
          target: "_blank",
          rel: "noopener noreferrer",
        };
        return attributes;
      },
    },
  });

  //投稿（メッセージ）を削除する処理
  const messageDelete = async () => {
    //削除する前に確認ダイアログを出す
    const result = window.confirm("本当に削除してもよろしいですか？");
    /**削除しても良い場合の処理 */
    if (result) {
      await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .doc(message.documentId)
        .delete();
    }
    setAnchorEl(null);
  };

  //編集モードになる時の処理
  const messageEdit = () => {
    setEdit(true);
    setAnchorEl(null);
  };

  //編集時に編集キャンセルを押した時の処理
  const handleEditCancel = () => {
    setEdit(false);
    setText(message.text);
  };

  //編集の変更をfirestoreに保存する
  const handleEditUpdate = async () => {
    await db
      .collection("channels")
      .doc(channelId)
      .collection("chat")
      .doc(message.documentId)
      .set({ text: text }, { merge: true });
    await setEdit(false);
  };

  return (
    <>
      <div className={classes.message_container} ref={scrollRef}>
        <div className={classes.message_info}>
          <ListItemAvatar>
            <Avatar
              alt="Cindy Baker"
              src={message && message.avatarURL}
              className={classes.avatar}
              onClick={() => setOpenIcon(true)}
            />
          </ListItemAvatar>
          <h4>
            {message.name}
            <span>{new Date(message.createdAt?.toDate()).toString()}</span>
          </h4>
          <div>
            <Button
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              詳細
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={messageDelete}
                disabled={auth.currentUser.uid !== message.uid}
                style={{ color: "rgb(224, 33, 92)" }}
              >
                メッセージを削除する
              </MenuItem>
              <MenuItem
                onClick={messageEdit}
                disabled={auth.currentUser.uid !== message.uid}
                style={{ color: "rgb(27, 196, 125)" }}
              >
                メッセージを編集する
              </MenuItem>
              <MenuItem onClick={handleClose}>メッセージに返信する</MenuItem>
            </Menu>
          </div>
        </div>
        {message.image && (
          <img src={message.image} alt="画像" className={classes.img} />
        )}
        {edit ? (
          <>
            <TextField
              multiline
              id="js-text"
              autoFocus
              fullWidth
              inputRef={editRef}
              maxRows={20}
              placeholder={"メッセージを作成"}
              className={classes.edit_textField}
              value={text}
              name="textarea"
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleEditCancel}
              className={classes.cancel_button}
            >
              {" "}
              キャンセル
            </button>
            <button
              onClick={handleEditUpdate}
              className={classes.update_button}
            >
              編集を保存する
            </button>
              <button onClick={handleShowEmojis} className={classes.emojiIcon_button}>
                <TagFacesIcon color="primary" className={classes.emojiIcon} />
              </button>
            <div
              className={`${classes.emoji} ${!showEmojis && classes.hidden}`}
            >
              <Emoji pickEmoji={pickEmoji} />
            </div>
          </>
        ) : (
          <p
            className={classes.message_text}
            dangerouslySetInnerHTML={{
              __html: filterXSS(htmlText, {
                whiteList: {
                  a: ["href", "title", "target", "rel"],
                },
              }),
            }}
          />
        )}
        <UserDetailModal
          handleClose={handleModalClose}
          message={message}
          open={openIcon}
        />
      </div>
    </>
  );
};

export default MessageHome;
