import React, { useContext } from "react";
import "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { AuthContext } from "../context/auth";
import Link from "next/link";
import Router from "next/router";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Home = () => {
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    console.log(user.uid);
  };

  const handleLogout = async () => {
    (await auth.currentUser.uid) &&
      db
        .collection("users")
        .doc(auth.currentUser.uid)
        .update({ isOnline: false });
    await auth.signOut();
    Router.push("/");
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WELCOME TO MOKUMOKUAPP
            </Typography>
            <Button color="success">Profile</Button>
            {user ? (
              <>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <a>新規登録</a>
                </Link>
                <Link href="/signin">
                  <a>ログイン</a>
                </Link>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
     <Link href="/chat/messages"><a>チャットへ</a></Link>
    </>
  );
};

export default Home;
