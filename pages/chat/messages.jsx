import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import ChatUser from '../../components/ChatUser'
import Header from '../../components/Header'
import classes from '../../styles/messages.module.scss'
import Router from 'next/router'

import { db, auth } from "../../firebase/firebase";

import Box from '@mui/material/Box';



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
      <div className={classes.grid}>
        <div >
          <div className={classes.users}>
            {users.map((user) => (
              <ChatUser key={user.uid} user={user} selectedUser={selectedUser}/>
            ))}
          </div>
        </div>
        <div>
          <div>
            <h1>こんにちは</h1>
          </div>
        </div>
      </div>
    </Box>
    </>
  );
};

export default Messages;
