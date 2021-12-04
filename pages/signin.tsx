import React, { useState } from "react";
import { signinWithEmailAndPassword, db } from "../firebase/firebase";
import Link from "next/link";
import Router from "next/router";
import classes from "../styles/signin/signin.module.scss";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface valuesType {
  password: string;
  showPassword: boolean;
}

const Signin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [values, setValues] = useState<valuesType>({
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

  const handleSignin = async (e) => {
    e.preventDefault();
    const result = await signinWithEmailAndPassword(email, password);
    await db
      .collection("users")
      .doc(result.user.uid)
      .update({ isOnline: true });
    (await result) && Router.push("/home/3fSVoNmwFQWi9zYg63Fw");
  };

  return (
    <>
      <h1 className={classes.app_title1}>MOKUPUTに&nbsp;ログイン</h1>

      <Box className={classes.form_wrapper}>
        <h2>切磋琢磨できる仲間を見つけて、一緒に高め合おう！</h2>
        <form onSubmit={handleSignin}>
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
            <button className={classes.button} type="submit">
              ログインする
            </button>
          </div>
        </form>
      </Box>
      <Link href="/signup">
        <a className={classes.signup}>サインアップへ</a>
      </Link>
    </>
  );
};

export default Signin;
