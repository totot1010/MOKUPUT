import React, { useRef, useEffect } from "react";
import classes from "../../styles/reply/ReplyMessage.module.scss";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

interface Props {
  reply: {
    uid: string;
    name: string;
    isOnline: boolean;
    avatarURL?: string;
    text: string;
    documentId: string;
    experience?: string;
    useLanguage?: Array<string>;
    willLanguage?: Array<string>;
    createdAt: any;
  };
}

const Reply: React.FC<Props> = (props) => {
  const { reply } = props;
  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({
      block: "end",
    });
  }, [reply]);

  return (
    <>
      <div className={classes.reply_container} ref={scrollRef}>
        <div className={classes.reply_header}>
          <ListItemAvatar>
            <Avatar
              src={reply && reply.avatarURL}
              sx={{
                height: "46px",
                width: "46px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            />
          </ListItemAvatar>
          <h3>
            {reply.name}
            <span>
              {format(
                new Date(reply.createdAt?.toDate()),
                "yyyy年MM月dd日 H:mm",
                { locale: ja }
              )}
            </span>
          </h3>
        </div>
        <div className={classes.reply_text}>
          <p>{reply.text}</p>
        </div>
      </div>
    </>
  );
};

export default Reply;
