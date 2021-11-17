import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import classes from "../../styles/chat/ChatUser.module.scss";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";

const UserOnline = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserOffline = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#eb4034",
  },
}));

const ChatUser = (props) => {
  const { user, selectedUser, user1, chatUser } = props;
  const [data, setData] = useState("");

  const user2 = user.uid;

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    const unsub = db
      .collection("lastMessage")
      .doc(id)
      .onSnapshot((doc) => {
        setData(doc.data());
      });
    return () => unsub();
  }, []);

  return (
    <div
      className={`${classes.user_container} ${
        chatUser.name === user.name && classes.selected_user
      }`}
      onClick={() => selectedUser(user)}
    >
      <div className={classes.user_info}>
        <div className={classes.user_detail}>
          {user.isOnline ? (
            <UserOnline
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar className={classes.avatar} src={user.avatarURL} />
            </UserOnline>
          ) : (
            <UserOffline
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar className={classes.avatar} src={user.avatarURL} />
            </UserOffline>
          )}
          <div>
            <h4 className={classes.text}>{user.name}</h4>
          </div>
          <br />
        </div>
      </div>
      {data && <p className={classes.lastMessage}>{data.text}</p>}
    </div>
  );
};

export default ChatUser;