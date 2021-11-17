import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../../firebase/firebase";
import Router from "next/router";
import { useRouter } from "next/router";
import classes from "../../styles/home/SearchUser.module.scss";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const UserDetailModal = (props) => {
  const { handleClose, message, open } = props;
  const { uid, name, avatarURL, isOnline } = message;
  const router = useRouter();

  const user1 = auth.currentUser.uid;

  //メッセージ送信を押した時にそれぞれのユーザーをフィールドに追加
  const firestoreAdd = async ({ uid, name, avatarURL, isOnline }) => {
    if (user1 === uid) return;
    const newId = user1 > uid ? `${user1 + uid}` : `${uid + user1}`;

    await db
      .collection("users")
      .doc(user1)
      .collection("chatUser")
      .doc(uid)
      .set({ uid, name, avatarURL, isOnline }, { merge: true });

    await Router.push(`/chat/${user1}/${uid}`);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={classes.box}>
        <Typography variant="h6" className={classes.title}>
          ユーザー詳細
          <Button
            className={classes.message_button}
            variant="outlined"
            onClick={() => firestoreAdd({ uid, name, avatarURL, isOnline })}
          >
            メッセージを送る
          </Button>
          <CloseIcon
            fontSize="large"
            className={classes.closeIcon}
            onClick={handleClose}
          />
        </Typography>
        <div className={classes.img_wrapper}>
          <img className={classes.image} src={message && message.avatarURL} />
        </div>
        <Stack spacing={2}>
          <Typography className={classes.typograpphy_name}>名前</Typography>
          <Typography className={classes.input}>
            {message && message.name}
          </Typography>
          <Typography className={classes.typography}>実務経験</Typography>
          <Typography className={classes.input}>
            {message && message.experience === "yes" ? "あり" : "なし"}
          </Typography>
          <Typography className={classes.typography}>
            実務で使っている言語
          </Typography>
          <Typography className={classes.input}>
            {message &&
              message.useLanguage.map((language, index) => {
                if (index + 1 === message.useLanguage.length) {
                  return <span key={index}>{language}</span>;
                } else {
                  return <span key={index}>{language}&#44;&nbsp;</span>;
                }
              })}
          </Typography>
          <Typography className={classes.typography}>勉強中の言語</Typography>
          <Typography className={classes.input}>
            {message &&
              message.willLanguage.map((language, index) => {
                if (index + 1 === message.willLanguage.length) {
                  return <span key={index}>{language}</span>;
                } else {
                  return <span key={index}>{language}&#44;&nbsp;</span>;
                }
              })}
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default UserDetailModal;
