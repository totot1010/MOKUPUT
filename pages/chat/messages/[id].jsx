import React, { useState, useEffect, useContext } from "react";
import { db, auth, storage } from "../../../firebase/firebase";
import firebase from "firebase/app";
import { AuthContext } from "../../../context/auth";

import ChatUser from "../../../components/ChatUser";
import Header from "../../../components/Header";
import MessageForm from "../../../components/MessageForm";
import Message from "../../../components/Message";

import classes from "../../../styles/directUser.module.scss";
import Router from "next/router";

import Box from "@mui/material/Box";

const directChat = ({ id }) => {
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthContext);
  console.log(messages);

  const user1 = auth.currentUser.uid;

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

  //ユーザーを選択した時にFirestoreからメッセージを取ってきてステートに格納
  const selectedUser = async (user) => {
    setChatUser(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const messagesRef = await db
      .collection("messages")
      .doc(id)
      .collection("chat");
    messagesRef
      .orderBy("createdAt")
      .get()
      .then((snap) => {
        const texts = [];
        snap.forEach((doc) => {
          texts.push(doc.data());
        });
        setMessages(texts);
      });
  };

  //画像とテキストを送信した時の挙動
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user2 = chatUser.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    if (img) {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await imageRef.put(img);
      await snap.ref.getDownloadURL().then(async function (URL) {
        await db.collection("messages").doc(id).collection("chat").add({
          text,
          from: user1,
          to: user2,
          createdAt: firebase.firestore.Timestamp.now(),
          media: URL,
        });
        setText("");
      });
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <div className={classes.grid_container}>
          <div>
            <div className={classes.users_container}>
              {users.map((user) => (
                <ChatUser
                  key={user.uid}
                  user={user}
                  selectedUser={selectedUser}
                />
              ))}
            </div>
          </div>
          <div>
            <div className={classes.messages_container}>
              <div className={classes.messages_user}>
                <h3 className={classes.text}>{chatUser.name}</h3>
              </div>
              <div className={classes.messages}>
                {messages.length
                  ? messages.map((message, index) => (
                      <Message key={index} message={message} user1={user1} />
                    ))
                  : null}
              </div>
              <MessageForm
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
              />
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default directChat;

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
