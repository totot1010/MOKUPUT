import React, { useState, useEffect } from "react";
import classes from "../../../styles/reply/ReplyMessage.module.scss";
import { db, auth } from "../../../firebase/firebase";
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

const ReplyMessage: React.FC = () => {
  const [mainMessage, setMainMessage] = useState<any>();
  const [text, setText] = useState<string>("");
  const [user, setUser] = useState<any>();
  const [replies, setReplies] = useState([]);

  const router = useRouter();
  const messageId: any = router.query.messageId;
  const channelId: any = router.query.channelId;
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

      db.collection("users")
        .doc(auth.currentUser.uid)
        .onSnapshot((snapshot) => {
          setUser({ id: auth.currentUser.uid, ...snapshot.data() });
        });
    };

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
        uid: auth.currentUser.uid,
        avatarURL: user.avatarURL,
        name: user.name,
        createdAt: firebase.firestore.Timestamp.now(),
        useLanguage: user.useLanguage,
        willLanguage: user.willLanguage,
        experience: user.experience,
        isOnline: user.isOnline,
      });

    await db
      .collection("channels")
      .doc(channelId)
      .collection("chat")
      .doc(messageId)
      .set(
        {
          replies: firebase.firestore.FieldValue.increment(1),
        },
        { merge: true }
      );

    setText("");

    if (mainMessage.uid == auth.currentUser.uid) return;
    await db
      .collection("notifications")
      .doc(mainMessage.uid)
      .collection("notice")
      .add({
        text,
        uid: auth.currentUser.uid,
        avatarURL: user.avatarURL || null,
        unread: true,
        channelId,
        messageId,
        message: true,
        notification: `${user.name}さんからあなたの投稿に対して📤返信しました。`,
        createdAt: firebase.firestore.Timestamp.now(),
      });
  };

  return (
    <>
      <div className={classes.home_back_wrapper}>
        <Link href={`/home/${channelId}`}>
          <a>
            <ArrowBackIcon
              sx={{ width: "50px", height: "50px", marginTop: "8px" }}
              className={classes.back_home_icon}
              color="primary"
            />
          </a>
        </Link>
      </div>
      <div className={classes.reply_home_container}>
        <div className={classes.message_body}>
          <div className={classes.message_header}>
            <ListItemAvatar>
              <Avatar
                src={(mainMessage && mainMessage.avatarURL) || null}
                sx={{ width: "60px", height: "60px" }}
              />
            </ListItemAvatar>
            <h4>
              {mainMessage && mainMessage.name}
              <span>
                {mainMessage &&
                  format(
                    new Date(mainMessage.createdAt.toDate()),
                    "yyyy年MM月dd日 H:mm",
                    { locale: ja }
                  )}
              </span>
            </h4>
          </div>
          <h2 className={classes.message_text}>
            {mainMessage && mainMessage.text}
          </h2>
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
