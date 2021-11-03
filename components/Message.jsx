import React from "react";
import Moment from "react-moment";
import classes from "../styles/Message.module.scss";

const Message = (props) => {
  const { message, user1 } = props;

  return (
    <>
      <div>
        <p>
          {message.media ? (
            <img src={message.media} alt={message.text} />
          ) : null}
          {message.text}
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
