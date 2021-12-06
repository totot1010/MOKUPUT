import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchUsers from "../components/home/SearchUsers";
import classes from "../styles/home/home.module.scss";
import algoliasearch from "algoliasearch";
import { db, auth, storage } from "../firebase/firebase";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Channel from "../components/home/Channel";
import Router from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NoAuthUser from "../components/NoAuthUser/NoAuthUser";

const ALGOLIA_INDEX_NAME = "study-app";
const client = algoliasearch("77WZ20O6OE", "60af8ce0883b0f3a5ae5612e6bbf239f");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const Home = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState();
  const [channels, setChannels] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [openNoAuthUserModal, setOpenNoAuthUserModal] = useState(false);

  useEffect(() => {
    db.collection("channels").onSnapshot((snapshot) => {
      const names = [];
      snapshot.forEach((doc) => {
        names.push({ documentId: doc.id, ...doc.data() });
      });
      setChannels(names);
    });
  }, []);

  const onSearch = async (e) => {
    await setSearchText(e.target.value);
    if (e.target.value === "") return setSearchUsers([]);
    await index
      .search(e.target.value, {
        attributesToHighlight: [],
      })
      .then(({ hits }) => {
        setSearchUsers(hits);
      });
  };

  const handleChat = () => {
    Router.push(`/chat/${auth.currentUser.uid}`);
  };

  const handleSidebarClose = () => {
    setShowSidebar(!showSidebar);
  };

  const handleOpenSidebar = () => {
    setShowSidebar(!showSidebar);
  };

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

  const HandleOpenNoAuthUserModal = (e) => {
    setOpenNoAuthUserModal(true);
  };
  const HandleCloseNoAuthUserModal = () => setOpenNoAuthUserModal(false);

  return (
    <>
      <Header
        onSearch={onSearch}
        setSearchUsers={setSearchUsers}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div
        className={classes.list}
        sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}
      >
        {searchUsers &&
          searchUsers.map((user) => {
            return (
              <SearchUsers
                key={user.objectID}
                id={user.objectID}
                isOnline={user.isOnline}
                avatarURL={user.avatarURL}
                name={user.name}
                useLanguage={user.useLanguage}
                willLanguage={user.willLanguage}
              />
            );
          })}
      </div>
      <div className={classes.homebody}>
        <div className={classes.sidebar_container}>
          {auth.currentUser === null ? (
            <div
              className={classes.sidebar_channel}
              onClick={HandleOpenNoAuthUserModal}
            >
              <MailOutlineIcon className={classes.message_icon} />
              <h3>メッセージ</h3>
            </div>
          ) : (
            <div className={classes.sidebar_channel} onClick={handleChat}>
              <MailOutlineIcon className={classes.message_icon} />
              <h3 style={{ marginLeft: "16px" }}>メッセージ</h3>
            </div>
          )}
          <hr />
          {auth.currentUser === null ? (
            <div
              className={classes.addchannels_container}
              onClick={HandleOpenNoAuthUserModal}
            >
              <AddIcon className={classes.add_icon} />
              <h3>チャンネルを追加</h3>
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
        <div className={classes.select_channel_text}>
          <ArrowBackIcon
            className={classes.open_sidebar}
            onClick={handleOpenSidebar}
          />
          <h1>チャンネルを選択してください。</h1>
        </div>
      </div>
      <NoAuthUser
        openNoAuthUserModal={openNoAuthUserModal}
        HandleCloseNoAuthUserModal={HandleCloseNoAuthUserModal}
      />
    </>
  );
};

export default Home;
