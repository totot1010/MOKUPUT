import React, { useState } from "react";
import { db, signupWithEmailAndPassword } from "../firebase/firebase";
import firebase from "firebase/app";

import classes from "../styles/signup.module.scss";
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
  const [datetime, setDatetime] = useState("");
  const [values, setValues] = useState({
    amount: "",
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //formタグのEnterを押した時の挙動
  const signup = async (e) => {
    e.preventDefault();
    setDatetime(e.currentTarget.value);
    const user = await signupWithEmailAndPassword(email, password);
    const newUserId = user.user.uid;
    await firestoreAdd(newUserId);
    (await user) && Router.push(`/signup/${newUserId}`);

    setEmail("");
    setPassword("");
  };

  const firestoreAdd = (id) => {
    db.collection("users").doc(id).set({
      email: email,
      createdAt: firebase.firestore.Timestamp.now(),
      isOnline: true,
    });
  };

  return (
    <>
      <h1>MOKUMOKUAPP</h1>
      <Box
        className={classes.form_wrapper}
      >
        <h2>切磋琢磨できる仲間を見つけて、一緒に高め合おう！</h2>
        <form onSubmit={signup}>
          <div  className={classes.form}>
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
          <div  className={classes.button_wrapper}>
            <Button className={classes.button} variant="outlined" type="submit">
              登録する
            </Button>
          </div>
        </form>
      </Box>
      <footer className={classes.footer}></footer>
    </>
  );
};

export default Signup;