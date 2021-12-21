import React, { useState, useEffect } from "react";
import classes from "../../styles/chat/ChatUser.module.scss";
import { db, auth } from "../../firebase/firebase";
import { useRouter } from "next/router";
import Router from "next/router";
import Link from "next/link";
import ChatUser from "../../components/chat/ChatUser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Messages = () => {
  const [users, setUsers] = useState([]);
  const [chatUser, setChatUser] = useState();
  const [chatId, setChatId] = useState<string | string[]>();
  const router = useRouter();

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    // idがqueryで利用可能になったら処理される
    if (router.asPath !== router.route) {
      setChatId(router.query.uid);
    }
  }, [router]);

  useEffect(() => {
    const getFireStore = async () => {
      //idでqueryがまだ利用できない時に処理される
      if (!router.isReady) return;
      //idでqueryが利用可能になってから処理される
      if (chatId) {
        //firestoreから自身のチャットユーザーを取得
        await db
          .collection("users")
          .doc(user1)
          .collection("chatUser")
          .get()
          .then((snap) => {
            const users = [];
            snap.forEach((doc) => {
              users.push(doc.data());
            });
            setUsers(users);
          });
      }
    };
    getFireStore();
  }, [chatId, router.isReady]);

  //ユーザーを選択した時の処理
  const selectedUser = async (user) => {
    setChatUser(user);

    /**チャットする相手のid */
    const user2 = user.uid;
    Router.push(`/chat/${user1}/${user2}`);
  };

  return (
    <>
      <div className={classes.grid_container}>
        <div className={classes.users_container}>
          <div style={{ display: "flex" }}>
            <Link href="/home/3fSVoNmwFQWi9zYg63Fw">
              <a className={classes.back_wrapper}>
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
        <div className={classes.select_user_text}>
          <h1>メッセージを送るユーザーを選択してください。</h1>
        </div>
      </div>
    </>
  );
};

export default Messages;
