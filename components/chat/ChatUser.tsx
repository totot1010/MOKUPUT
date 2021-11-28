import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import classes from "../../styles/chat/ChatUser.module.scss";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";

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

interface Props {
  user: {
    avatarURL?: string | null;
    isOnline: boolean;
    name: string;
    uid: string;
  };
  selectedUser: (object) => void;
  user1: string;
  chatUser: {
    avatarURL?: string | null;
    isOnline?: boolean;
    name?: string;
    uid?: string;
  };
}

interface lastMessageType {
  createdAt: object;
  from: string;
  text: string;
  to: string;
  unread: boolean;
}

const ChatUser: React.FC<Props> = (props) => {
  const { user, selectedUser, user1, chatUser } = props;
  const [lastMessageData, setLastMessageData] = useState<lastMessageType>();

  const user2: string = user.uid;

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    db.collection("lastMessage").doc(id).onSnapshot <
      ((doc) => {
        setLastMessageData(doc.data());
      });
  }, []);

  return (
    <>
      <div
        className={`${classes.user_container} ${
          chatUser?.name === user.name && classes.selected_user
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
                <Avatar
                  sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  src={user.avatarURL}
                />
              </UserOnline>
            ) : (
              <UserOffline
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  src={user.avatarURL}
                />
              </UserOffline>
            )}
            <div>
              <h4 className={classes.text}>{user.name}</h4>
              {lastMessageData?.from !== user1 && lastMessageData?.unread && (
                <small className={classes.unread}>New</small>
              )}
            </div>
            <br />
          </div>
        </div>
        {lastMessageData && (
          <p className={classes.lastMessage}>{lastMessageData.text}</p>
        )}
      </div>
      <div
        onClick={() => selectedUser(user)}
        className={`${classes.sm_container} ${
          chatUser.name === user.name && classes.selected_user
        }`}
      >
        <div className={classes.user_detail}>
          {user.isOnline ? (
            <UserOnline
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src={user.avatarURL}
              />
            </UserOnline>
          ) : (
            <UserOffline
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar
                sx={{ width: "50px", height: "50px", borderRadius: "50%" }}
                src={user.avatarURL}
              />
            </UserOffline>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatUser;
