import React, { useRef, useEffect } from "react";
import { db } from "../../firebase/firebase";
import anchorme from "anchorme";
import { filterXSS } from "xss";

import Moment from "react-moment";
import classes from "../../styles/chat/Message.module.scss";

const Message = (props) => {
  const { message, user1 } = props;
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behaivor: "smooth", block: "end" });
  }, [message]);

  //テキストに含まれているURLの文字列をaタグに変換
  const htmlText = anchorme({
    input: message.text,
    options: {
      //https://がついていないリンクも変換してくれる
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

  const handleMessageDelete = async () => {
    if (message.from === user1) {
      const result = window.confirm("クリックしたメッセージを削除しますか？");

      const id =
        user1 > message?.to
          ? `${user1 + message?.to}`
          : `${message?.to + user1}`;

      if (result) {
        await db
          .collection("messages")
          .doc(id)
          .collection("chat")
          .doc(message.documentId)
          .delete();
      }
    }
  };

  return (
    <>
      <div
        className={`${classes.message_wrapper} ${
          message && message.from === user1 ? classes.own : ""
        }`}
        ref={scrollRef}
        onClick={handleMessageDelete}
      >
        {message.media ? (
          <>
            <p
              className={`${
                message.from === user1 ? classes.me : classes.friend
              }`}
            >
              {message.media ? (
                <img src={message.media} alt={message.text} />
              ) : null}
              <span
                className={classes.span}
                dangerouslySetInnerHTML={{
                  __html: filterXSS(htmlText, {
                    whiteList: {
                      a: ["href", "title", "target", "rel"],
                    },
                  }),
                }}
              />
              <br />
            </p>
            <div
              className={`${
                message.from === user1
                  ? classes.moment_containerI
                  : classes.moment_containerYou
              }`}
            >
              <small>
                <Moment fromNow>{message.createdAt.toDate()}</Moment>
              </small>
            </div>
          </>
        ) : (
          <>
            <p
              className={`${classes.message_wrapper2} ${
                message.from === user1 ? classes.me : classes.friend
              }`}
            >
              <span
                className={classes.span}
                dangerouslySetInnerHTML={{
                  __html: filterXSS(htmlText, {
                    whiteList: {
                      a: ["href", "title", "target", "rel"],
                    },
                  }),
                }}
              />
            </p>
            <div
              className={`${
                message.from === user1
                  ? classes.moment_containerI
                  : classes.moment_containerYou
              }`}
            >
              <small>
                <Moment fromNow>{message.createdAt.toDate()}</Moment>
              </small>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Message;
