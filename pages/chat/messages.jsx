import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import ChatUser from '../../components/ChatUser'
import classes from '../../styles/messages.module.scss'
import Router from 'next/router'

import { db, auth } from "../../firebase/firebase";

import Box from '@mui/material/Box';



const Messages = () => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [chatUser, setChatUser] = useState('')

  const user1 = auth.currentUser.uid

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
    setChatUser(user)
    user && Router.push(`/chat/messages/${user.uid}`)
  }


  return (
    <>
    <Box sx={{ flexGrow: 1 }}>
      <div className={classes.grid}>
        <div >
          <div className={classes.users}>
            {users.map((user) => (
                 <ChatUser
                  key={user.uid}
                  user={user}
                  selectedUser={selectedUser}
                  user1={user1}
                  chatUser={chatUser}
                  />
            ))}
          </div>
        </div>
        <div>
           <h3 className={classes.no_conversation}>
                  トークを始めるユーザーを選択してください！
                </h3>
        </div>
      </div>
    </Box>
    </>
  );
};

export default Messages;
