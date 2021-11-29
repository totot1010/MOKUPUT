import React, { useState, useEffect } from "react";
import classes from "../../styles/home/Homebody.module.scss";
import { db, auth, storage } from "../../firebase/firebase";
import firebase from "firebase/app";
import { AuthUserType } from "../../types/user";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ComputerIcon from "@mui/icons-material/Computer";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Channel from "./Channel";
import HomeForm from "./HomeForm";
import Router from "next/router";
import MessageHome from "./MessageHome";
import { useRouter } from "next/router";
import { useAllUsers } from "../../hooks/useAllUsers";

const Homebody: React.FC = () => {
  const [channel, setChannel] = useState<any>();
  const [channels, setChannels] = useState([]);
  const [user, setUser] = useState<AuthUserType>();
  const [text, setText] = useState("");
  const [img, setImg] = useState<any>();
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const router = useRouter();

  const channelId: any = router.query.channelId;

  //現在ログインしてるユーザーのid（自分）
  const user1 = auth.currentUser.uid;

  useEffect(() => {
    const getFirestore = async () => {
      await db.collection("channels").onSnapshot((snapshot) => {
        const names = [];
        snapshot.forEach((doc) => {
          names.push({ documentId: doc.id, ...doc.data() });
        });
        setChannels(names);
      });

      db.collection("channels")
        .doc(channelId)
        .onSnapshot((doc) => {
          setChannel({ id: channelId, ...doc.data() });
        });

      const messagesRef = db
        .collection("channels")
        .doc(channelId)
        .collection("chat");
      messagesRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
        const texts = [];
        querySnapshot.forEach((doc) => {
          texts.push({ documentId: doc.id, ...doc.data() });
        });
        setMessages(texts);
      });

      db.collection("users")
        .doc(user1)
        .onSnapshot((snapshot) => {
          setUser(snapshot.data() as AuthUserType);
        });
    };
    getFirestore();
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

  //チャンネルを選択した時の挙動
  const selectedChannel = async (channel) => {
    setChannel(channel);

    const messagesRef = await db
      .collection("channels")
      .doc(channel.documentId)
      .collection("chat");
    messagesRef.orderBy("createdAt").onSnapshot((querySnapshot) => {
      const texts = [];
      querySnapshot.forEach((doc) => {
        texts.push({ ...doc.data(), documentId: doc.id });
      });
      setMessages(texts);
    });

    (await channel) && Router.push(`/home/${channel.documentId}`);
  };

  //画像とテキストを送信した時の挙動
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (img) {
      const storageRef = storage.ref();
      const imageRef = storageRef.child(
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await imageRef.put(img);
      await snap.ref.getDownloadURL().then(function (URL) {
        db.collection("channels")
          .doc(channelId)
          .collection("chat")
          .add({
            text,
            from: user1,
            createdAt: firebase.firestore.Timestamp.now(),
            image: URL,
            avatarURL: user.avatarURL || null,
            name: user.name,
            uid: user.uid,
            useLanguage: user.useLanguage,
            willLanguage: user.willLanguage,
            experience: user.experience,
          });
        setText("");
        setImg("");
      });
    } else {
      if (text === "") return;
      await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .add({
          text,
          from: user1,
          createdAt: firebase.firestore.Timestamp.now(),
          avatarURL: user.avatarURL || null,
          name: user.name,
          uid: user.uid,
          useLanguage: user.useLanguage,
          willLanguage: user.willLanguage,
          experience: user.experience,
          isOnline: user.isOnline,
        });
      setText("");
    }
  };

  //チャットページに画面遷移する処理
  const handleChat = () => {
    Router.push(`/chat/${user1}`);
  };

  const handleSidebarClose = () => {
    setShowSidebar(!showSidebar);
  };

  const handleOpenSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className={classes.homebody}>
      <div className={classes.sidebar_container}>
        <div className={classes.sidebar_channel} onClick={handleChat}>
          <MailOutlineIcon className={classes.message_icon} />
          <h3>メッセージ</h3>
        </div>
        <hr />
        <div className={classes.addchannels_container} onClick={addChannel}>
          <AddIcon className={classes.add_icon} />
          <h3>チャンネルを追加</h3>
        </div>
        <hr />
        <div className={classes.channels}>
          {channels &&
            channels.map((channel, index) => (
              <Channel
                key={index}
                channel={channel}
                selectedChannel={selectedChannel}
              />
            ))}
        </div>
      </div>
      <div
        className={`${classes.sm_sidebar_container} ${
          showSidebar && classes.sidebar_close
        }`}
      >
        <div
          className={classes.sidebar_close_button}
          onClick={handleSidebarClose}
        >
          <CloseIcon className={classes.sidebar_close_icon} />
          <h3>サイドバーを閉じる</h3>
        </div>
        <div className={classes.sidebar_channel} onClick={handleChat}>
          <MailOutlineIcon className={classes.message_icon} />
          <h3>メッセージ</h3>
        </div>
        <hr />
        <div className={classes.addchannels_container} onClick={addChannel}>
          <AddIcon className={classes.add_icon} />
          <h3>チャンネルを追加</h3>
        </div>
        <hr />
        <div className={classes.channels}>
          {channels &&
            channels.map((channel, index) => (
              <Channel
                key={index}
                channel={channel}
                selectedChannel={selectedChannel}
              />
            ))}
        </div>
      </div>

      <div className={classes.appbody_container}>
        <div className={classes.header_container}>
          <h2>
            <ArrowBackIcon
              className={classes.open_sidebar}
              onClick={handleOpenSidebar}
            />
            <ComputerIcon className={classes.header_icon} />
            {channel && channel.name}
          </h2>
        </div>
        <div className={classes.messages_wrapper}>
          {messages.length
            ? messages.map((message, index) => {
                return <MessageHome key={index} message={message} />;
              })
            : null}
        </div>
        <HomeForm
          channel={channel}
          handleSubmit={handleSubmit}
          text={text}
          setText={setText}
          setImg={setImg}
        />
      </div>
    </div>
  );
};

export default Homebody;