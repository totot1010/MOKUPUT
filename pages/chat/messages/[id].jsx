import React,{useState, useEffect, useContext} from 'react'
import { db, auth } from "../../../firebase/firebase";
import firebase from 'firebase/app';
import { AuthContext } from "../../../context/auth";

import ChatUser from '../../../components/ChatUser'
import Header from '../../../components/Header'
import MessageForm from '../../../components/MessageForm'

import classes from '../../../styles/directUser.module.scss'
import Router from 'next/router'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



const directChat = ({id}) => {
  const [users, setUsers] = useState([]);
  const [chatUser , setChatUser] = useState('')
  const [text, setText] = useState('')
  const { user } = useContext(AuthContext);

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const user2 = chatUser.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`
    console.log(id)

    await db.collection('messages').doc(id).collection('chat').add({
      text,
      from: user1,
      to: user2,
      createdAt: firebase.firestore.Timestamp.now(),
    })
    setText('')
  }

  return (
    <>
   <Header />
    <Box sx={{ flexGrow: 1 }}>
      <div className={classes.grid_container} >
        <div>
          <div className={classes.users_container}>
            {users.map((user) => (
              <ChatUser key={user.uid} user={user} selectedUser={selectedUser}/>
            ))}
          </div>
        </div>
        <div >
          <div className={classes.messages_container}>
            {chatUser ? (
              <>
              <div className={classes.messages_user}>
              <h3 className={classes.text}>{chatUser.name}</h3>
              </div>
              <MessageForm handleSubmit={handleSubmit} text={text} setText={setText}/>
              </>
            ) : (
              <h3 className={classes.no_conversation}>トークを始めるユーザーを選択してください！</h3>
            )}
          </div>
        </div>
      </div>
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

