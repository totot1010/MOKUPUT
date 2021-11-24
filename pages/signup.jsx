import React, { useState } from "react";
import { db, signupWithEmailAndPassword } from "../firebase/firebase";
import firebase from "firebase/app";
import Link from "next/link";

import classes from "../styles/signup/signup.module.scss";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import Router from "next/router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [values, setValues] = useState({
    amount: "",
    password: "",
    showPassword: false,
  });

  //クリックすることで打ったパスワードが表示される
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  //マウスクリック時のデフォルトの動作をキャンセル
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  //formタグのEnterを押した時の処理
  const handleSignup = async (e) => {
    //サインアップが成功した場合
    try {
      e.preventDefault();

      //サインアップしたユーザーにメールを送る
      const user = await signupWithEmailAndPassword(email, password);
      const newUserId = user.user.uid;
      await firestoreAdd(newUserId);
      //サインアップしたユーザーが入れば、ユーザー詳細ページに飛ばす
      (await user) && Router.push(`/signup/${newUserId}`);

      setEmail("");
      setPassword("");
    } catch {
      //サインアップが失敗した場合

      setEmail("");
      setPassword("");
    }
  };

  //サインアップ時にfirestoreにデータを保存する処理
  const firestoreAdd = (id) => {
    db.collection("users").doc(id).set({
      email: email,
      createdAt: firebase.firestore.Timestamp.now(),
      isOnline: true,
    });
  };

  return (
    <>
      <h1 className={classes.app_title}>ようこそ&nbsp;MOKUPUT&nbsp;へ</h1>
      <Box className={classes.form_wrapper}>
        <h2>切磋琢磨できる仲間を見つけて、一緒に高め合おう！</h2>
        <form onSubmit={handleSignup}>
          <div className={classes.form}>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                メールアドレス
              </InputLabel>
              <OutlinedInput
                className={classes.input_mail}
                id="outlined-adornment-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="メールアドレス"
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                パスワード
              </InputLabel>
              <OutlinedInput
                className={classes.input_password}
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="パスワード"
              />
            </FormControl>
          </div>
          <div className={classes.button_wrapper}>
            <button className={classes.button} variant="outlined" type="submit">
              登録する
            </button>
          </div>
        </form>
      </Box>
      <Link href="/signin">
        <a className={classes.signin}>サインインへ</a>
      </Link>
    </>
  );
};

export default Signup;
