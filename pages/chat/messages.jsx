import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import ChatUser from '../../components/ChatUser'
import Header from '../../components/Header'
import classes from '../../styles/messages.module.scss'
import Router from 'next/router'

import { db, auth } from "../../firebase/firebase";

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Messages = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const usersRef = db.collection("users");
    usersRef
      .where("uid", "not-in", [user.uid])
      .get()
      .then((snap) => {
        const users = [];
        snap.forEach((doc) => {
          users.push(doc.data());
        });
        setUsers(users);
      });
  }, []);

  const selectedUser = (user) => {
    console.log(user.uid)
    user && Router.push(`/chat/messages/${user.uid}`)
  }


  return (
    <>
    <Header />
    <Box sx={{ flexGrow: 1 }}>
      <Grid container className={classes.grid_container}>
        <Grid item xs={5}>
          <Item className={classes.users_container}>
            {users.map((user) => (
              <ChatUser key={user.uid} user={user} selectedUser={selectedUser}/>
            ))}
          </Item>
        </Grid>
        <Grid item xs={7}>
          <Item>
            aaa
          </Item>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Messages;
