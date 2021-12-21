import React, { useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import Avatar from "@mui/material/Avatar";
import classes from "../../styles/home/Notifications.module.scss";
import Router from "next/router";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const Notice = (props) => {
  const { notice } = props;

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    getFirestore();
  }, []);

  const getFirestore = async () => {
    await db
      .collection("notifications")
      .doc(user1)
      .collection("notice")
      .doc(notice.documentId)
      .set(
        {
          unread: false,
        },
        { merge: true }
      );
  };

  const handleChannelPage = () => {
    Router.push(`/home/${notice.channelId}`);
  };

  const handleChatPage = () => {
    Router.push(`/chat/${user1}/${notice.uid}`);
  };

  const handleReplyPage = () => {
    Router.push(`/home/${notice.channelId}/${notice.messageId}`);
  };

  return (
    <>
      {notice.like ? (
        <div className={classes.notice_container} onClick={handleChannelPage}>
          <div className={classes.notice_header}>
            <Avatar
              src={notice.avatarURL}
              sx={{
                height: "46px",
                width: "46px",
                borderRadius: "8px",
              }}
            />
            <h4>
              {notice.notification}
              <p>
                {format(
                  new Date(notice.createdAt?.toDate()),
                  "yyyy年MM月dd日 H:mm",
                  { locale: ja }
                )}
              </p>
            </h4>
          </div>
          <div className={classes.notice_text}>
            <p>{notice.text}</p>
          </div>
        </div>
      ) : null}
      {notice.chat ? (
        <div className={classes.notice_container} onClick={handleChatPage}>
          <div className={classes.notice_header}>
            <Avatar
              src={notice.avatarURL}
              sx={{
                height: "46px",
                width: "46px",
                borderRadius: "8px",
              }}
            />
            <h4>
              {notice.notification}
              <p>
                {format(
                  new Date(notice.createdAt?.toDate()),
                  "yyyy年MM月dd日 H:mm",
                  { locale: ja }
                )}
              </p>
            </h4>
          </div>
          <div className={classes.notice_text}>
            <p>{notice.text}</p>
          </div>
        </div>
      ) : null}
      {notice.message ? (
        <div className={classes.notice_container} onClick={handleReplyPage}>
          <div className={classes.notice_header}>
            <Avatar
              src={notice.avatarURL}
              sx={{
                height: "46px",
                width: "46px",
                borderRadius: "8px",
              }}
            />
            <h4>
              {notice.notification}
              <p>
                {format(
                  new Date(notice.createdAt?.toDate()),
                  "yyyy年MM月dd日 H:mm",
                  { locale: ja }
                )}
              </p>
            </h4>
          </div>
          <div className={classes.notice_text}>
            <p>{notice.text}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Notice;
