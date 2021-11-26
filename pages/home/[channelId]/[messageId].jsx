import React, { useState, useEffect } from "react";
import classes from "../../../styles/reply/ReplyMessage.module.scss";
import { db, auth, storage } from "../../../firebase/firebase";
import firebase from "firebase/app";
import Link from "next/link";
import ReplyForm from "../../../components/reply/ReplyForm";
import Reply from "../../../components/reply/Reply";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import { useRouter } from "next/router";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";

const ReplyMessage = () => {
  const [mainMessage, setMainMessage] = useState();
  const [text, setText] = useState("");
  const [user, setUser] = useState();
  const [replies, setReplies] = useState([]);

  const router = useRouter();
  const messageId = router.query.messageId;
  const channelId = router.query.channelId;
  const user1 = auth.currentUser.uid;
  useEffect(() => {
    const getUserDetail = async () => {
      await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .doc(messageId)
        .onSnapshot((doc) => {
          setMainMessage({ ...doc.data(), documentId: doc.id });
        });

      const replyRef = await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .doc(messageId)
        .collection("reply");
      replyRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
        const replies = [];
        querySnapshot.forEach((doc) => {
          replies.push({ documentId: doc.id, ...doc.data() });
        });
        setReplies(replies);
      });
    };

    db.collection("users")
      .doc(user1)
      .onSnapshot((snapshot) => {
        setUser({ id: user1, ...snapshot.data() });
      });

    getUserDetail();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text === "") return;
    await db
      .collection("channels")
      .doc(channelId)
      .collection("chat")
      .doc(messageId)
      .collection("reply")
      .add({
        text,
        uid: user1,
        avatarURL: user.avatarURL,
        name: user.name,
        createdAt: firebase.firestore.Timestamp.now(),
        useLanguage: user.useLanguage,
        willLanguage: user.willLanguage,
        experience: user.experience,
        isOnline: user.isOnline,
      });
    setText("");
  };

  return (
    <>
      <div className={classes.home_back_wrapper}>
        <Link href={`/home/${channelId}`}>
          <a>
            <ArrowBackIcon className={classes.back_home_icon} color="primary" />
          </a>
        </Link>
      </div>
      <div className={classes.reply_home_container}>
        <div className={classes.message_body}>
          <div className={classes.message_header}>
            <ListItemAvatar>
              <Avatar
                src={mainMessage && mainMessage.avatarURL}
                className={classes.avatar}
              />
            </ListItemAvatar>
            <h4>{mainMessage && mainMessage.name}</h4>
            <span>
              {mainMessage &&
                format(
                  new Date(mainMessage.createdAt?.toDate()),
                  "yyyy年MM月dd日 H:mm",
                  { locale: ja }
                )}
            </span>
          </div>
          <h1 className={classes.message_text}>
            {mainMessage && mainMessage.text}
          </h1>
        </div>
        <div>
          {replies &&
            replies.map((reply) => {
              return (
                <div key={reply.documentId} className={classes.reply_wrapper}>
                  <Reply reply={reply} />
                </div>
              );
            })}
        </div>
      </div>
      <div className={classes.form_wrapper}>
        <ReplyForm
          mainMessage={mainMessage}
          handleSubmit={handleSubmit}
          text={text}
          setText={setText}
        />
      </div>
    </>
  );
};

export default ReplyMessage;
