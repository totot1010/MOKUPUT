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
import Loading from "../Loading";
import HomeForm from "./HomeForm";
import Router from "next/router";
import MessageHome from "./MessageHome";
import { useRouter } from "next/router";
import NoAuthUserText from "../NoAuthUser/NoAuthUserText";
import NoAuthUserIcon from "../NoAuthUser/NoAuthUserIcon";

const Homebody: React.FC = () => {
  const [channel, setChannel] = useState<any>();
  const [channels, setChannels] = useState([]);
  const [user, setUser] = useState<AuthUserType>();
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<any>();
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [openNoAuthUserModal, setOpenNoAuthUserModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const channelId: any = router.query.channelId;

  useEffect(() => {
    if (auth.currentUser === null) {
      getFirestoreExceptAuth();
    } else {
      getFirestore();
    }
  }, []);

  const getFirestore = async () => {
    await db.collection("channels").onSnapshot((snapshot) => {
      const names = [];
      snapshot.forEach((doc) => {
        names.push({ documentId: doc.id, ...doc.data() });
      });
      setChannels(names);
    });

    await db
      .collection("channels")
      .doc(channelId)
      .onSnapshot((doc) => {
        setChannel({ id: channelId, ...doc.data() });
      });

    await db
      .collection("channels")
      .doc(channelId)
      .collection("chat")
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const texts = [];
        querySnapshot.forEach((doc) => {
          texts.push({ documentId: doc.id, ...doc.data() });
        });
        setMessages(texts);
      });

    db.collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        setUser(snapshot.data() as AuthUserType);
        setLoading(false);
      });
  };

  const getFirestoreExceptAuth = async () => {
    await db.collection("channels").onSnapshot((snapshot) => {
      const names = [];
      snapshot.forEach((doc) => {
        names.push({ documentId: doc.id, ...doc.data() });
      });
      setChannels(names);
    });

    await db
      .collection("channels")
      .doc(channelId)
      .onSnapshot((doc) => {
        setChannel({ id: channelId, ...doc.data() });
      });

    await db
      .collection("channels")
      .doc(channelId)
      .collection("chat")
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const texts = [];
        querySnapshot.forEach((doc) => {
          texts.push({ documentId: doc.id, ...doc.data() });
        });
        setMessages(texts);
        setLoading(false);
      });
  };

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

    await Router.push(`/home/${channel.documentId}`);
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
            from: auth.currentUser.uid,
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
          from: auth.currentUser.uid,
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
    Router.push(`/chat/${auth.currentUser.uid}`);
  };

  const handleSidebarClose = () => {
    setShowSidebar(!showSidebar);
  };

  const handleOpenSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const HandleOpenNoAuthUserModal = (e) => {
    e.preventDefault();
    setText("");
    setOpenNoAuthUserModal(true);
  };
  const HandleCloseNoAuthUserModal = () => setOpenNoAuthUserModal(false);

  return (
    <div className={classes.homebody}>
      <div className={classes.sidebar_container}>
        {auth.currentUser === null ? (
          <div className={classes.sidebar_channel}>
            <MailOutlineIcon className={classes.message_icon} />
            <h3>
              <NoAuthUserText name="メッセージ" />
            </h3>
          </div>
        ) : (
          <div className={classes.sidebar_channel} onClick={handleChat}>
            <MailOutlineIcon className={classes.message_icon} />
            <h3 style={{ marginLeft: "16px" }}>メッセージ</h3>
          </div>
        )}
        <hr />
        {auth.currentUser === null ? (
          <div className={classes.addchannels_container}>
            <AddIcon className={classes.add_icon} />
            <h3>
              <NoAuthUserText name="チャンネルを追加" />
            </h3>
          </div>
        ) : (
          <div className={classes.addchannels_container} onClick={addChannel}>
            <AddIcon className={classes.add_icon} />
            <h3 style={{ marginLeft: "16px" }}>チャンネルを追加</h3>
          </div>
        )}
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
        {loading ? (
          <Loading />
        ) : (
          <>
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
              {messages && messages.length > 0 ? (
                messages.map((message, index) => {
                  return <MessageHome key={index} message={message} />;
                })
              ) : (
                <h1>まだ投稿がありません。</h1>
              )}
            </div>
            {auth.currentUser === null ? (
              <HomeForm
                channel={channel}
                handleSubmit={HandleOpenNoAuthUserModal}
                text={text}
                setText={setText}
                setImg={setImg}
              />
            ) : (
              <HomeForm
                channel={channel}
                handleSubmit={handleSubmit}
                text={text}
                setText={setText}
                setImg={setImg}
              />
            )}
            <NoAuthUserIcon
              openNoAuthUserModal={openNoAuthUserModal}
              setOpenNoAuthUserModal={setOpenNoAuthUserModal}
              HandleOpenNoAuthUserModal={HandleOpenNoAuthUserModal}
              HandleCloseNoAuthUserModal={HandleCloseNoAuthUserModal}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Homebody;
