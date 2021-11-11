import React, { useState, useEffect, useContext } from "react";
import { db, auth, storage } from "../../../firebase/firebase";
import firebase from "firebase/app";
import { AuthContext } from "../../../context/auth";
import {useRouter} from 'next/router'
import Router from 'next/router'
import ChatUser from "../../../components/ChatUser";
import DirectChatForm from "../../../components/MessageForm/DirectChatForm";
import Message from "../../../components/Message";
import classes from "../../../styles/directUser.module.scss";
import Box from "@mui/material/Box";

const directChat = () => {
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatId , setChatId] = useState()
  const { user } = useContext(AuthContext);
  const router = useRouter()
  const id = router.query.id

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setChatId(router.query.id);
    }
  }, [router]);

  useEffect(() => {
    const f = async () => {
      //idでqueryがまだ利用できない時に処理される
      if(!router.isReady) return ;
      //idでqueryが利用可能になってから処理される
      if (chatId) {
        //firestoreから自身のチャットユーザーを取得
        await db
        .collection("users")
        .doc(user1)
        .collection('chatUser')
        .get()
        .then((snap) => {
          const users = [];
          snap.forEach((doc) => {
            users.push(doc.data());
          });
          setUsers(users);
        });
        
        /**use1は自分のid, chatIdはチャットする相手のid*/
      const newId = user1 > chatId ? `${user1 + chatId}` : `${newId + chatId}`;
      
      /**チャットしている相手とのやり取りを取得する処理して表示させる */
      const messagesRef = await db
      .collection("messages")
        .doc(newId)
        .collection("chat");
      messagesRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
        const texts = [];
        querySnapshot.forEach((doc) => {
          texts.push(doc.data());
        });
        setMessages(texts);
      });
    };
  }
  f()
}, [chatId, router.isReady]);



  //ユーザーを選択した時の処理
  const selectedUser = async (user) => {
    setChatUser(user);
    /**チャットする相手のid */
    const user2 = user.id;

    /**use1は自分のid, user2はチャットする相手のid*/
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    /**チャットしている相手とのやり取りを取得する処理して表示させる */
    const messagesRef = await db
      .collection("messages")
      .doc(id)
      .collection("chat");
    messagesRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
      const texts = [];
      querySnapshot.forEach((doc) => {
        texts.push(doc.data());
      });
      setMessages(texts);
    });

    Router.push(`/chat/messages/${user2}`)
  };

  //画像とテキストを送信した時の挙動
  const handleSubmit = async (e) => {
    /**フォーム送信時の動作をキャンセルさせる */
    e.preventDefault();

    /**use1は自分のid, idはチャットする相手のid*/
    const newId = user1 > id ? `${user1 + id}` : `${id + user1}`;

    /**送信時に画像がある場合の処理 */
    if (img)  {

      /**firebaseのstorageの参照を作成 */
      const storageRef = storage.ref();

      /**storageに画像をアップロードする */
      const imageRef = storageRef.child(
        `images/${new Date().getTime()} - ${img.name}`
      );

      /**storageにある画像をダウンロードする */
      const snap = await imageRef.put(img);
      /**画像、テキストをfirestoreに保存する */
      await snap.ref.getDownloadURL().then(function (URL) {
        db.collection("messages").doc(newId).collection("chat").add({
          text,
          from: user1,
          to: id,
          createdAt: firebase.firestore.Timestamp.now(),
          media: URL,
        });

        /**一番最後に行われたメッセージをfirestoreに保存する */
         db.collection("lastMessage").doc(newId).set({
          text,
          from: user1,
          to: id,
          createdAt: firebase.firestore.Timestamp.now(),
          media: URL,
          unread: true,

        });
         setText("");
         setImg("");

      });
    } else {
      /**テキストがない場合の処理 */
      if (text === "") return;
      /**画像、テキストをfirestoreに保存する */
      await db.collection("messages").doc(newId).collection("chat").add({
        text,
        from: user1,
        to: id,
        createdAt: firebase.firestore.Timestamp.now(),
      });

        /**一番最後に行われたメッセージをfirestoreに保存する */
      await db.collection("lastMessage").doc(newId).set({
        text,
        from: user1,
        to: id,
        createdAt: firebase.firestore.Timestamp.now(),
        unread: true,
      });
      await setText("");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <div className={classes.grid_container}>
            <div className={classes.users_container}>
              {users.map((user,index) => (
                <ChatUser
                  key={index}
                  user={user}
                  selectedUser={selectedUser}
                  user1={user1}
                  chatUser={chatUser}
                />
              ))}
            </div>
            <div className={classes.messages_container}>
              <div className={classes.messages}>
                {messages.length
                  ? messages.map((message, index) => (
                      <Message key={index} message={message} user1={user1} />
                    ))
                  : null}
              </div>
              <div style={{width: '100%'}}>
              <DirectChatForm
                chatUser={chatUser}
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
