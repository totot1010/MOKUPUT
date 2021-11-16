import React from "react";
import classes from "../../styles/reply/ReplyMessage.module.scss";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

const Reply = (props) => {
  const { reply } = props;

  return (
    <>
      <div className={classes.reply_container}>
        <div className={classes.reply_header}>
          <ListItemAvatar>
            <Avatar src={reply && reply.avatarURL} className={classes.avatar} />
          </ListItemAvatar>
          <h3>{reply.name}</h3>
          <span>
            {format(
              new Date(reply.createdAt?.toDate()),
              "yyyy年MM月dd日 H:mm",
              { locale: ja }
            )}
          </span>
        </div>
        <div className={classes.reply_text}>
          <p>{reply.text}</p>
        </div>
      </div>
    </>
  );
};

export default Reply;
