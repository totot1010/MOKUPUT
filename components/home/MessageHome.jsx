import React, { useEffect, useRef, useState } from "react";
import anchorme from "anchorme";
import { filterXSS } from "xss";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import classes from "../../styles/home/Homebody.module.scss";
import Avatar from "@mui/material/Avatar";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import UserDetailModal from "../organism/user/UserDetailModal";
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
  }, [message.text]);

  //ユーザーをクリックした時の挙動
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const htmlText = anchorme({
    input: message.text,
    options: {
      exclude: (string) => {
        if (!string.startsWith("https://")) {
          return true;
        } else {
          return false;
        }
      },
      attributes: () => {
        const attributes = {
          target: "_blank",
          rel: "noopener noreferrer",
        };
        return attributes;
      },
    },
  });

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
        <p
          className={classes.message_text}
          dangerouslySetInnerHTML={{
            __html: filterXSS(htmlText, {
              whiteList: {
                a: ["href", "title", "target", "rel"],
              },
            }),
          }}
        />
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
