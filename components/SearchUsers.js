import React, { useState, useCallback, useEffect } from "react";
import { db } from "../firebase/firebase";
import classes from "../styles/SearchUser.module.scss";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";

const SearchUser = (props) => {
  const { id, name, useLanguage, willLanguage, image } = props;
  const [users, setUsers] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  console.log(users)

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          image: doc.data().image,
          experience: doc.data().experience,
          name: doc.data().name,
          age: doc.data().age,
          useLanguage: doc.data().useLanguage,
          willLanguage: doc.data().willLanguage,
        }))
      );
    });
  }, []);

  //ユーザーをクリックした時の挙動
  const handleOpen = ({ id, users }) => {
    const targetUser = users.find((user) => user.id === id);
    setSelectedUser(targetUser);
    setOpen(true);
  };

  //ユーザー詳細を閉じる時の挙動
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className={classes.container}>
      <ListItem
        alignItems="flex-start"
        onClick={() => handleOpen({ id, users })}
      >
        <ListItemAvatar>
          <Avatar alt="Cindy Baker" src={image} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              ></Typography>
              <span>言語:</span>
              {willLanguage.map((language, index) => {
                return <span key={index}>{language}&#44;&nbsp;</span>;
              })}
              {useLanguage.map((language, index) => {
                return <span key={index}>{language}&#44;&nbsp;</span>;
              })}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.box}>
          <Typography variant="h6" className={classes.title}>
            ユーザー詳細
            <CloseIcon
              fontSize="large"
              className={classes.closeIcon}
              onClick={handleClose}
            />
          </Typography>
          <Stack spacing={2}>
            <Typography className={classes.typography}>名前</Typography>
            <Typography className={classes.input}>
              {selectedUser && selectedUser.name}
            </Typography>
            <Typography className={classes.typography}>実務経験</Typography>
            <Typography className={classes.input}>
              {selectedUser
                ? selectedUser.experience
                  ? "あり"
                  : "なし"
                : "loading"}
            </Typography>
            <Typography className={classes.typography}>
              実務で使っている言語
            </Typography>
            <Typography className={classes.input}>
              {selectedUser && selectedUser.useLanguage.map((language, index) => {
                if (index + 1 === selectedUser.useLanguage.length) {
                    return (
                  <span key={index}>{language}</span>
                  )
                } else {
                  return (
                    <span key={index}>{language}&#44;&nbsp;</span>    
                    )
                  }
              })}
            </Typography>
            <Typography className={classes.typography}>勉強中の言語</Typography>
            <Typography className={classes.input}>
              {selectedUser && selectedUser.willLanguage.map((language, index) => {
                if (index + 1 === selectedUser.willLanguage.length) {
                    return (
                  <span key={index}>{language}</span>
                  )
                } else {
                  return (
                    <span key={index}>{language}&#44;&nbsp;</span>    
                    )
                  }
              })}
            </Typography>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default SearchUser;
