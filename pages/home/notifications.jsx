import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";

const notifications = () => {
  const [noticeText, setNoticeText] = useState();

  const user1 = auth.currentUser.uid;
  useEffect(() => {
    db.collection("notifications")
      .doc(user1)
      .collection("notice")
      .onSnapshot((querysnapshot) => {
        const texts = [];
        querysnapshot.forEach((doc) => {
          texts.push(doc.data().text);
        });
        setNoticeText(texts);
      });
  });
  return (
    <>
      <div>
        <p>{noticeText}</p>
      </div>
    </>
  );
};

export default notifications;
