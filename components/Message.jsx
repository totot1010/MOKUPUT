import React from "react";
import Moment from "react-moment";

const Message = (props) => {
  const { message, user1 } = props;

  return (
    <>
      <div className={`message_wrapper ${message.from === user1 ? 'own' : ''}`}>
        <p className={message.from === user1 ? 'me' : 'friend'}>
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
      <style jsx='true'>{`
      .message_wrapper {
        margin-top: 5px;
        padding: 0px 5px;
      }
      .message_wrapper img {
        width: 100%;
        border-radius: 5px;
      }
      
      .message_wrapper p {
        padding: 10px;
        display: inline-block;
        max-width: 50%;
        text-align: left;
        border-radius: 5px;
      }
      
      .message_wrapper small {
        display: inline-block;
        margin-top: 15px;
        opacity: 0.8;
      }

      .message_wrapper.own {
        text-align: right;
      }

      .me {
        background-color: #0084ff;
        color:white;
      }

      .friend {
        background-color: #333;
        color: white;
      }

      `}</style>
    </>
  );
};

export default Message;
