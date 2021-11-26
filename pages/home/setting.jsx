import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import firebase from "firebase/app";
import classes from "../../styles/home/Setting.module.scss";
import Link from "next/link";
import Router from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";

const setting = () => {
  const [authUser, setAuthUser] = useState();
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteChatUsers, setDeleteChatUsers] = useState([]);
  const [alertPasswordChange, setAlertPasswordChange] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const user1 = auth.currentUser.uid;
  const AuthEmail = auth.currentUser.email;

  useEffect(() => {
    getFirestore();
  }, []);

  const getFirestore = async () => {
    await db
      .collection("users")
      .doc(user1)
      .onSnapshot((snapshot) => {
        setAuthUser({ id: user1, ...snapshot.data() });
      });

    await db
      .collection("users")
      .doc(user1)
      .collection("chatUser")
      .get()
      .then((querySnapshot) => {
        const chatUserUid = [];
        querySnapshot.forEach((doc) => {
          chatUserUid.push(doc.data().uid);
        });
        setDeleteChatUsers(chatUserUid);
      });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNewPasswordSave = async () => {
    AuthEmail !== currentEmail && alert("メールアドレスが間違っています");
    if (newPassword === confirmPassword) {
      const credential = await firebase.auth.EmailAuthProvider.credential(
        AuthEmail,
        authUser.password
      );

      await db
        .collection("users")
        .doc(user1)
        .set({ password: newPassword }, { merge: true });

      await auth.currentUser
        .reauthenticateWithCredential(credential)
        .then(() => {
          auth.currentUser.updatePassword(newPassword);
        });
      setCurrentEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setAlertPasswordChange(true);
    } else {
      alert("新しいパスワードと確認用のパスワードが一致していません。");
    }
  };

  const handleUserDelete = async () => {
    const credential = await firebase.auth.EmailAuthProvider.credential(
      AuthEmail,
      authUser.password
    );
    if (currentPassword === authUser.password) {
      const result = window.confirm(
        "一度削除したユーザーは復元できません。本当に削除してもよろしいですか？"
      );
      if (result) {
        await auth.currentUser
          .reauthenticateWithCredential(credential)
          .then(() => {
            auth.currentUser.delete();
          });

        await deleteChatUsers.map((deleteChatUser) => {
          db.collection("users")
            .doc(user1)
            .collection("chatUser")
            .doc(deleteChatUser)
            .delete();
        });

        await db.collection("users").doc(user1).delete();
        Router.push("/signup");
      }
    } else {
      alert("パスワードが間違っています。");
    }
  };

  return (
    <>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Snackbar
          open={alertPasswordChange}
          autoHideDuration={3000}
          onClose={() => setAlertPasswordChange(false)}
        >
          <Alert severity="success">パスワードを変更しました。</Alert>
        </Snackbar>
      </Stack>
      <div className={classes.home_back_wrapper}>
        <Link href={"/home/eJhpxQwVn9zbq09GIZel"}>
          <a>
            <ArrowBackIcon
              className={classes.back_home_icon}
              color="primary"
              sx={{ fontSize: "48px", margin: "8px" }}
            />
          </a>
        </Link>
      </div>
      <div className={classes.setting_container}>
        <div className={classes.change_password_container}>
          <div className={classes.password_header}>
            <h2>パスワードを変更する</h2>
          </div>
          <div className={classes.current_password}>
            <TextField
              label="現在のメールアドレス"
              variant="outlined"
              fullWidth
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
            />
          </div>
          <div className={classes.new_password}>
            <FormControl
              variant="outlined"
              fullWidth
              sx={{ marginBottom: "24px" }}
            >
              <InputLabel htmlFor="outlined-New-password">
                新しいパスワード
              </InputLabel>
              <OutlinedInput
                id="outlined-New-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-Confirm-password">
                パスワードの確認
              </InputLabel>
              <OutlinedInput
                id="outlined-Confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </div>
          <button
            disabled={
              currentEmail === "" ||
              newPassword === "" ||
              confirmPassword === ""
            }
            onClick={handleNewPasswordSave}
          >
            保存
          </button>
        </div>
        <div className={classes.delete_user_container}>
          <div className={classes.delete_user_header}>
            <h2>アカウントを削除する</h2>
          </div>
          <div className={classes.delete_user_explanation}>
            <h4>アカウントを削除するためにパスワードを入力してください。</h4>
          </div>
          <div className={classes.current_password}>
            <TextField
              label="パスワード"
              variant="outlined"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <button disabled={currentPassword === ""} onClick={handleUserDelete}>
            削除
          </button>
        </div>
      </div>
    </>
  );
};

export default setting;
