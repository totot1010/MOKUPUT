import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import classes from "../../styles/home/Notifications.module.scss";
import Link from "next/link";
import Router from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Notice from "../../components/home/Notice";

const notifications = () => {
  const [notifications, setNotifications] = useState();

  const user1 = auth.currentUser.uid;

  useEffect(() => {
    getFirestore();
  }, []);

  const getFirestore = async () => {
    await db
      .collection("notifications")
      .doc(user1)
      .collection("notice")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        const notificationData = [];
        querySnapshot.forEach((doc) => {
          notificationData.push({ documentId: doc.id, ...doc.data() });
        });
        setNotifications(notificationData);
      });
  };

  return (
    <>
      <div className={classes.home_back_wrapper}>
        <Link href={"/home/eJhpxQwVn9zbq09GIZel"}>
          <a>
            <ArrowBackIcon
              className={classes.back_home_icon}
              color="primary"
              sx={{ fontSize: "48px", margin: "8px" }}
            />
          </a>
        </Link>
      </div>
      <div className={classes.notifications_container}>
        <div className={classes.notifications_header}>
          <h2>通知</h2>
        </div>
        <div className={classes.current_password}>
          {notifications && notifications
            ? notifications.map((notice, index) => {
                return <Notice key={index} notice={notice} />;
              })
            : null}
        </div>
      </div>
    </>
  );
};

export default notifications;
