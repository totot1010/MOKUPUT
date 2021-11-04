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
        <p className={`${message.from === user1 ? classes.me : classes.friend}`}>
          {message.media ? (
            <img src={message.media} alt={message.text} />
          ) : null}
          <small className={classes.small}>{message.text}</small>
          <br />
          <small>
            <Moment fromNow>{message.createdAt.toDate()}</Moment>
          </small>
        </p>
      </div>
    </>
  );
};

export default Message;
