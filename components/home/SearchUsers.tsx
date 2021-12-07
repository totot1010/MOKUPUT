import React, { useState, useCallback, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import Link from "next/link";
import classes from "../../styles/home/SearchUser.module.scss";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { useAllUsers } from "../../hooks/useAllUsers";
import NoAuthCurrentUser from "../NoAuthUser/NoAuthUserButton";

interface Props {
  id: string;
  name: string;
  isOnline: boolean;
  avatarURL?: string;
  useLanguage?: Array<string>;
  willLanguage?: Array<string>;
}

const SearchUser: React.FC<Props> = (props) => {
  const { id, name, useLanguage, willLanguage, avatarURL, isOnline } = props;
  const { users, getUsers } = useAllUsers();

  const [open, setOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>();

  useEffect(() => {
    getUsers();
  }, []);

  //ユーザーをクリックした時の挙動
  const handleOpen = ({ id, users }) => {
    const targetUser = users.find((user) => user.id === id);
    setSelectedUser(targetUser);
    setOpen(true);
  };

  //ユーザー詳細を閉じる時の挙動
  const handleClose = useCallback(() => setOpen(false), []);

  //メッセージ送信を押した時にそれぞれのユーザーをフィールドに追加
  const firestoreAdd = async ({ id, name, avatarURL, isOnline }) => {
    const newId =
      auth.currentUser.uid > id
        ? `${auth.currentUser.uid + id}`
        : `${id + auth.currentUser.uid}`;

    await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("chatUser")
      .doc(id)
      .set(
        {
          uid: id,
          name,
          avatarURL: avatarURL || null,
          isOnline,
        },
        { merge: true }
      );
  };

  return (
    <>
      <div className={classes.search_user_container_and_detail}>
        <div
          onClick={() => handleOpen({ id, users })}
          className={classes.search_user_container}
        >
          <div className={classes.search_user_header}>
            <Avatar
              src={avatarURL}
              sx={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginRight: "8px",
                textAlign: "center",
              }}
            />
            <h3>{name}</h3>
          </div>
          <p>
            {useLanguage.map((language, index) => {
              return (
                <span className={classes.language} key={index}>
                  {language}&#44;&nbsp;
                </span>
              );
            })}
            <br />
            {willLanguage.map((language, index) => {
              return (
                <span className={classes.language} key={index}>
                  {language}&#44;&nbsp;
                </span>
              );
            })}
          </p>
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box className={classes.detail_user_box}>
            <Typography variant="h6" className={classes.detail_user_title}>
              ユーザー詳細
              {auth.currentUser === null ? (
                <NoAuthCurrentUser name="メッセージを送る" />
              ) : (
                <Link href={`/chat/${auth.currentUser.uid}/${id}`}>
                  <a
                    className={classes.message_button}
                    onClick={() =>
                      firestoreAdd({ id, name, avatarURL, isOnline })
                    }
                  >
                    メッセージを送る
                  </a>
                </Link>
              )}
              <CloseIcon
                fontSize="large"
                className={classes.closeIcon}
                onClick={handleClose}
              />
            </Typography>
            <div className={classes.detail_avatar_wrapper}>
              <Avatar
                src={selectedUser && selectedUser.avatarURL}
                sx={{
                  position: "relative",
                  top: "12px",
                  width: "100px",
                  height: "100px",
                }}
              />
            </div>
            <Stack spacing={2}>
              <Typography className={classes.typograpphy_name}>名前</Typography>
              <Typography className={classes.input_text}>
                {selectedUser && selectedUser.name}
              </Typography>
              <Typography className={classes.typography}>実務経験</Typography>
              <Typography className={classes.input_text}>
                {selectedUser && selectedUser.experience === "yes"
                  ? "あり"
                  : "なし"}
              </Typography>
              <Typography className={classes.typography}>
                実務で使っている言語
              </Typography>
              <Typography className={classes.input_text}>
                {selectedUser && selectedUser.useLanguage.length === 0 ? (
                  <span>なし</span>
                ) : (
                  selectedUser &&
                  selectedUser.useLanguage.map((language, index) => {
                    return <span key={index}>{language}&#44;&nbsp;</span>;
                  })
                )}
              </Typography>
              <Typography className={classes.typography}>
                勉強中の言語
              </Typography>
              <Typography className={classes.input_text}>
                {selectedUser &&
                  selectedUser.willLanguage.map((language, index) => {
                    if (index + 1 === selectedUser.willLanguage.length) {
                      return <span key={index}>{language}</span>;
                    } else {
                      return <span key={index}>{language}&#44;&nbsp;</span>;
                    }
                  })}
              </Typography>
            </Stack>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default SearchUser;
