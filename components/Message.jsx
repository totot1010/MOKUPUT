import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import classes from '../styles/Message.module.scss'

const Message = (props) => {
  const { message, user1 } = props;
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behaivor: "smooth", block: 'end' });
  }, [message]);


  return (
    <>
      <div
        className={`${classes.message_wrapper} ${message && message.from === user1 ? classes.own : ""}`}
        ref={scrollRef}
      >
        {message.media ? (
        <p className={`${message.from === user1 ? classes.me : classes.friend}`}>
          {message.media ? (
            <img src={message.media} alt={message.text} />
          ) : null}
          <span className={classes.span}>{message.text}</span>
          <br />
          <small>
            <Moment fromNow>{message.createdAt.toDate()}</Moment>
          </small>
        </p>
        ) : (
        <p className={`${classes.message_wrapper2} ${message.from === user1 ? classes.me : classes.friend}`}>
          <span className={classes.span}>{message.text}</span>
          <br />
          <small>
            <Moment fromNow>{message.createdAt.toDate()}</Moment>
          </small>
        </p>
        )}
      </div>
    </>
  );
};

export default Message;
