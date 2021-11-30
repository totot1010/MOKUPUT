import React, { useState, useEffect, useContext } from "react";
import { db, auth, storage } from "../../../firebase/firebase";
import firebase from "firebase/app";
import { AuthContext } from "../../../context/auth";
import { useRouter } from "next/router";
import { AuthUserType } from "../../../types/user";
import Router from "next/router";
import Link from "next/link";
import ChatUser from "../../../components/chat/ChatUser";
import DirectChatForm from "../../../components/chat/DirectChatForm";
import Message from "../../../components/chat/Message";
import classes from "../../../styles/chat/ChatUser.module.scss";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const DirectChat = () => {
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState<any>("");
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<any>();
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState<string | string[]>("");
  const [authUser, setAuthUser] = useState<AuthUserType>();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const id: any = router.query.id;

  const user1: string = auth.currentUser.uid;

  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setChatId(id);
    }
  }, [router]);

  useEffect(() => {
    const f = async () => {
      //idでqueryがまだ利用できない時に処理される
      if (!router.isReady) return;
      //idでqueryが利用可能になってから処理される
      if (chatId) {
        //firestoreから自身のチャットユーザーを取得
        await db
          .collection("users")
          .doc(user1)
          .collection("chatUser")
          .onSnapshot((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
              users.push(doc.data());
            });
            setUsers(users);
          });

        /**use1は自分のid, chatIdはチャットする相手のid*/
        const newId =
          user1 > chatId ? `${user1 + chatId}` : `${chatId + user1}`;

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

        const docSnap = await db.collection("lastMessage").doc(newId).get();
        if (docSnap.data()?.from !== user1) {
          await db.collection("lastMessage").doc(newId).set(
            {
              unread: false,
            },
            { merge: true }
          );
        }
      }

      await db
        .collection("users")
        .doc(user1)
        .onSnapshot((doc) => {
          setAuthUser(doc.data() as AuthUserType);
        });
    };
    f();
  }, [chatId, router.isReady]);

  //ユーザーを選択した時の処理
  const selectedUser = async (user) => {
    setChatUser(user);
    /**チャットする相手のid */
    const user2 = user.uid;

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
        texts.push({ documentId: doc.id, ...doc.data() });
      });
      setMessages(texts);
    });

    const docSnap = await db.collection("lastMessage").doc(id).get();
    if (docSnap.data()?.from !== user1) {
      await db.collection("lastMessage").doc(id).set(
        {
          unread: false,
        },
        { merge: true }
      );
    }

    Router.push(`/chat/${user1}/${user2}`);
  };

  //画像とテキストを送信した時の挙動
  const handleSubmit = async (e) => {
    /**フォーム送信時の動作をキャンセルさせる */
    e.preventDefault();

    /**use1は自分のid, idはチャットする相手のid*/
    const newId = user1 > id ? `${user1 + id}` : `${id + user1}`;

    await db
      .collection("users")
      .doc(id)
      .collection("chatUser")
      .doc(authUser.uid)
      .set({
        name: authUser.name,
        isOnline: authUser.isOnline,
        avatarURL: authUser.avatarURL || null,
        uid: authUser.uid,
      });

    /**送信時に画像がある場合の処理 */
    if (img) {
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

        db.collection("notifications")
          .doc(id)
          .collection("notice")
          .add({
            text,
            uid: user1,
            media: URL,
            avatarURL: authUser.avatarURL || null,
            unread: true,
            chat: true,
            notification: `${authUser.name}さんから新しい📤メッセージが届きました。`,
            createdAt: firebase.firestore.Timestamp.now(),
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

      db.collection("notifications")
        .doc(id)
        .collection("notice")
        .add({
          text,
          uid: user1,
          avatarURL: authUser.avatarURL || null,
          unread: true,
          chat: true,
          notification: `${authUser.name}さんから💌メッセージが届きました。`,
          createdAt: firebase.firestore.Timestamp.now(),
        });
      await setText("");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <div className={classes.grid_container}>
          <div className={classes.users_container}>
            <div style={{ display: "flex" }}>
              <Link href="/home/eJhpxQwVn9zbq09GIZel">
                <a className={classes.back_home_wrapper}>
                  <ArrowBackIcon color="primary" sx={{ ml: 2, fontSize: 40 }} />
                </a>
              </Link>
            </div>
            <hr />
            {users.map((user, index) => (
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
            <div style={{ width: "100%" }}>
              <DirectChatForm
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

export default DirectChat;
