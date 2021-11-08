import React, { useState, useEffect } from "react";

import classes from "../../styles/home/Homebody.module.scss";
import { db } from "../../firebase/firebase";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import Channel from "./Channel";
import HomeForm from "../../components/MessageForm/HomeForm";
import Router from 'next/router'


const Homebody = ({id}) => {
  const [channels, setChannels] = useState([]);
  const [channelName, setChannelName] = useState();
  const [selectChannel, setSelectChannel] = useState()
  console.log(selectChannel)


  useEffect(() => {
    const unsub = db.collection("channels").onSnapshot((snapshot) => {
      const names = [];
      snapshot.forEach((doc) => {
        names.push({ id: doc.id, ...doc.data() });
      });
      setChannels(names);
    });
    return () => unsub();


  }, []);

  //チャンネルを追加した時の挙動
  const addChannel = () => {
    const channelName = window.prompt("チャンネル名を入力してください！");
    if (channelName) {
      db.collection("channels").add({
        name: channelName,
      });
    }
  };

  const selectedChannel = (channel) => {
    setSelectChannel(channel)
    
    Router.push(`/home/${channel.id}`)
  }

  return (
    <div className={classes.homebody}>
      <div className={classes.sidebar_container}>
        <div className={classes.sidebar_channel}>
          <ExpandMoreIcon className={classes.expandIcon} />
          <h3>チャンネル</h3>
        </div>
        <hr />
        <div className={classes.addchannels_container} onClick={addChannel}>
          <AddIcon />
          <h3>チャンネルを追加</h3>
        </div>
        <hr />
        <div className={classes.channels}>
          {channels &&
            channels.map((doc, index) => <Channel key={index} doc={doc} selectedChannel={selectedChannel} />)}
        </div>
      </div>

      <div className={classes.appbody_cotainer}>
        <div>
          <h2>{selectChannel && selectChannel.name}</h2>
        </div>

        <HomeForm />
      </div>
    </div>
  );
};

export default Homebody;

export const getStaticPaths = async () => {
  const snapshot = await db.collection("channels").get();
  return {
    paths: snapshot.docs.map((doc) => ({
      params: {
        id: doc.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = ({ params: { id } }) => {
  return {
    props: { id },
  };
};

