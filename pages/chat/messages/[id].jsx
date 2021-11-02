import React,{useState, useEffect, useContext} from 'react'
import { db, auth } from "../../../firebase/firebase";
import { AuthContext } from "../../../context/auth";

import ChatUser from '../../../components/ChatUser'
import Header from '../../../components/Header'
import classes from '../../../styles/directUser.module.scss'
import Router from 'next/router'

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


const directChat = ({id}) => {
  const [users, setUsers] = useState([]);
  const [chat , setChat] = useState('')
  const { user } = useContext(AuthContext);
console.log(user.uid)

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
    setChat(user)
    user && Router.push(`/chat/messages/${user.uid}`)
  }
  return (
    <>
   <Header />
    <Box sx={{ flexGrow: 1 }}>
      <Grid container >
        <Grid item xs={5}>
          <Item className={classes.users_container}>
            {users.map((user) => (
              <ChatUser key={user.uid} user={user} selectedUser={selectedUser}/>
            ))}
          </Item>
        </Grid>
        <Grid item xs={7}>
          <Item className={classes.messages_container}>
            {chat ? (
              <div className={classes.messages_user}>
              <h3>{chat.name}</h3>
              </div>
            ) : (
              <h3 className={classes.no_conversation}>トークを始めるユーザーを選択してください！</h3>
            )}
          </Item>
        </Grid>
      </Grid>
    </Box>
    </>
  )
}

export default directChat

export const getStaticPaths = async () => {
  const snapshot = await db.collection("users").get();
  return {
    paths: snapshot.docs.map((doc) => ({
      params: {
        id: doc.data().uid,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  return {
    props: { id },
  };
};

