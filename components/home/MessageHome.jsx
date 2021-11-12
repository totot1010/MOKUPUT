import React,{useEffect, useRef, useState} from "react";
import firebase from "firebase/app";
import {auth} from '../../firebase/firebase'

import ListItemAvatar from "@mui/material/ListItemAvatar";
import classes from "../../styles/home/Homebody.module.scss";
import Avatar from "@mui/material/Avatar";
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import UserDetailModal from '../organism/user/UserDetailModal'
import { useRouter } from "next/router";
import { useAllUsers } from "../../hooks/useAllUsers";

const MessageHome = (props) => {
  const {message } = props
  const scrollRef = useRef();
  const { users, getUsers } = useAllUsers();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behaivor: "smooth", block: "end" });
  }, [message.image, message.text]);

  useEffect(() => {
    getUsers();
  }, []);

      //ユーザーをクリックした時の挙動
      const handleOpen = () => {
        setOpen(true);
      };

  const handleClose = () => setOpen(false);



  return (
    <>
    <div className={classes.message_container}  ref={scrollRef}>
      <ListItemAvatar >
        <Avatar alt="Cindy Baker" src={message && message.avatarURL} className={classes.avatar} onClick={handleOpen}/>
      </ListItemAvatar>
      <img src={message.image} alt="" />
      <div className={classes.messae_info}>
        <h4>
          {message.name} <span>{new Date(message.createdAt?.toDate()).toString()}</span>
        </h4>
        <p>{message.text}</p>
      </div>
      <UserDetailModal  handleClose={handleClose} message={message} open={open}/>
    </div>
    </>
  );
};

export default MessageHome;
