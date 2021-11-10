import React,{useEffect, useRef} from "react";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import classes from "../../styles/home/Homebody.module.scss";
import Avatar from "@mui/material/Avatar";
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

const MessageHome = (props) => {
  const {avatarURL,image, name, text, from, timestamp  } = props
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behaivor: "smooth", block: "end" });
  }, [image, text]);

  return (
    <>
    <div className={classes.message_container}  ref={scrollRef}>
      <ListItemAvatar>
        <Avatar alt="Cindy Baker" src={avatarURL && avatarURL} className={classes.avatar} />
      </ListItemAvatar>
      <img src={image} alt="" />
      <div className={classes.messae_info}>
        <h4>
          {name} <span>{new Date(timestamp?.toDate()).toUTCString()}</span>
        </h4>
        <p>{text}</p>
      </div>
    </div>
    </>
  );
};

export default MessageHome;
