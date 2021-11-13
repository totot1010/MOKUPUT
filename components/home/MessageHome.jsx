import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import { auth } from "../../firebase/firebase";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import classes from "../../styles/home/Homebody.module.scss";
import Avatar from "@mui/material/Avatar";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import UserDetailModal from "../organism/user/UserDetailModal";
import { useRouter } from "next/router";
import { useAllUsers } from "../../hooks/useAllUsers";

const MessageHome = (props) => {
  const { message } = props;
  const scrollRef = useRef();
  const { users, getUsers } = useAllUsers();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behaivor: "smooth", block: "end" });
  }, [message.image, message.text]);

  useEffect(() => {
    getUsers();
    // AutoLink();
  }, [message.text]);

  // const AutoLink = () => {
  //   var regexp_url = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g; // ']))/;正規表現（/〜/）を解釈してくれないエディタ等で自動整形を崩さないため。
  //   var regexp_makeLink = function (all, url, h, href) {
  //     return '<a href="h' + href + '" target="_blank">' + url + "</a>";
  //   };
  //   var textWithLink = message.text.replace(regexp_url, regexp_makeLink);
  //   document.getElementById("js-result").innerHTML = textWithLink;
  // };

  //ユーザーをクリックした時の挙動
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={classes.message_container} ref={scrollRef}>
        <div className={classes.message_info}>
          <ListItemAvatar>
            <Avatar
              alt="Cindy Baker"
              src={message && message.avatarURL}
              className={classes.avatar}
              onClick={handleOpen}
            />
          </ListItemAvatar>
          <h4>
            {message.name}{" "}
            <span>{new Date(message.createdAt?.toDate()).toString()}</span>
          </h4>
        </div>
        {message.image && (
          <img src={message.image} alt="画像" className={classes.img} />
        )}
        <p id="js-result">{message.text}</p>
        <UserDetailModal
          handleClose={handleClose}
          message={message}
          open={open}
        />
      </div>
    </>
  );
};

export default MessageHome;
