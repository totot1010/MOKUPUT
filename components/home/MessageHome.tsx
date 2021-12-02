import React, { useEffect, useRef, useState, createRef } from "react";
import { db, auth } from "../../firebase/firebase";
import firebase from "firebase/app";
import anchorme from "anchorme";
import { filterXSS } from "xss";
import { useRouter } from "next/router";
import Router from "next/router";
import Emoji from "../../emojis/emojisComponent";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import classes from "../../styles/home/Homebody.module.scss";
import Avatar from "@mui/material/Avatar";
import UserDetailModal from "./UserDetailModal";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NoAuthUserText from "../NoAuthUser/NoAuthUserText";
import NoAuthUserIcon from "../NoAuthUser/NoAuthUserIcon";

interface Props {
  message: {
    uid: string;
    name: string;
    isOnline: boolean;
    avatarURL?: string;
    from: string;
    text: string;
    image?: string;
    documentId: string;
    experience?: string;
    useLanguage?: Array<string>;
    willLanguage?: Array<string>;
    createdAt: any;
  };
}

const MessageHome: React.FC<Props> = (props) => {
  const { message } = props;
  const scrollRef = useRef<HTMLDivElement>();
  const editRef = createRef<HTMLInputElement>();
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>(message.text);
  const [countMessage, setCountMessage] = useState<Array<string>>();
  const [userLikes, setUserLikes] = useState<Array<string>>();
  const [user, setUser] = useState<any>();
  const [openNoAuthUserModal, setOpenNoAuthUserModal] = useState(false);

  const open = Boolean(anchorEl);
  const router = useRouter();
  const channelId: any = router.query.channelId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    scrollRef.current.scrollIntoView({ block: "end" });
  }, [message.image, message.text]);

  useEffect(() => {
    //投稿に対しての返信の数をfirestoreから取得する
    db.collection("channels")
      .doc(channelId)
      .collection("chat")
      .doc(message.documentId)
      .collection("reply")
      .onSnapshot((querySnapshot) => {
        const counts = [];
        querySnapshot.forEach((doc) => {
          counts.push(doc.data().uid);
        });
        setCountMessage(counts);
      });

    //投稿に対してのいいねの数をfiestoreから取得する
    db.collection("channels")
      .doc(channelId)
      .collection("chat")
      .doc(message.documentId)
      .collection("like")
      .onSnapshot((querySnapshot) => {
        const likeUsers = [];
        querySnapshot.forEach((doc) => {
          likeUsers.push(doc.data().uid);
        });
        setUserLikes(likeUsers);
      });

    //現在のユーザーのデータをfirestoreから取得
    if (auth.currentUser === null) return;
    db.collection("users")
      .doc(auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        setUser(snapshot.data());
      });
  }, []);

  const pickEmoji = (e, { emoji }) => {
    const ref: any = editRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const message = start + emoji + end;
    setText(message);
    setShowEmojis(!showEmojis);
  };

  //絵文字を開く
  const handleShowEmojis = (e): void => {
    e.preventDefault();
    editRef.current.focus();
    setShowEmojis(!showEmojis);
  };

  const handleModalClose = () => setOpenIcon(false);

  //テキストに含まれているURLの文字列をaタグに変換
  const htmlText = anchorme({
    input: message.text,
    options: {
      //https://がついていないリンクも変換してくれる
      exclude: (string) => {
        if (!string.startsWith("https://")) {
          return true;
        } else {
          return false;
        }
      },
      attributes: () => {
        const attributes = {
          target: "_blank",
          rel: "noopener noreferrer",
        };
        return attributes;
      },
    },
  });

  //投稿（メッセージ）を削除する処理
  const messageDelete = async () => {
    //削除する前に確認ダイアログを出す
    const result = window.confirm("本当に削除してもよろしいですか？");
    /**削除しても良い場合の処理 */
    if (result) {
      await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .doc(message.documentId)
        .delete();
    }
    setAnchorEl(null);
  };

  //編集モードになる時の処理
  const messageEdit = () => {
    setEdit(true);
    setAnchorEl(null);
  };

  //編集時に編集キャンセルを押した時の処理
  const handleEditCancel = () => {
    setEdit(false);
    setText(message.text);
  };

  //編集の変更をfirestoreに保存する
  const handleEditUpdate = async () => {
    await db
      .collection("channels")
      .doc(channelId)
      .collection("chat")
      .doc(message.documentId)
      .set({ text: text }, { merge: true });
    await setEdit(false);
  };

  const handleLike = async () => {
    //いいね押したユーザーの中から自分のuidを取ってくる
    const authLikeUser = await userLikes.find(
      (userLike) => userLike === auth.currentUser.uid
    );

    //uidが返ってこない時
    if (!authLikeUser) {
      await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .doc(message.documentId)
        .collection("like")
        .add({ uid: user.uid });

      if (message.uid === auth.currentUser.uid) return;
      await db
        .collection("notifications")
        .doc(message.uid)
        .collection("notice")
        .add({
          notification: `${user.name}さんがあなたの投稿に😍いいねを押しました。`,
          text: text,
          avatarURL: user.avatarURL,
          like: true,
          unread: true,
          channelId,
          uid: user.uid,
          createdAt: firebase.firestore.Timestamp.now(),
        });
    }
    //uidが返って来た時
    else {
      await db
        .collection("channels")
        .doc(channelId)
        .collection("chat")
        .doc(message.documentId)
        .collection("like")
        .where("uid", "==", auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
    }
  };

  //メッセージページに遷移する
  const handleReplyPage = () => {
    Router.push(`/home/${channelId}/${message.documentId}`);
  };

  const HandleOpenNoAuthUserModal = () => setOpenNoAuthUserModal(true);
  const HandleCloseNoAuthUserModal = () => setOpenNoAuthUserModal(false);

  return (
    <>
      <div className={classes.message_container} ref={scrollRef}>
        <div className={classes.message_info}>
          <Avatar
            src={message && message.avatarURL}
            sx={{
              height: "46px",
              width: "46px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => setOpenIcon(true)}
          />
          <h4>
            {message.name}
            <span>
              {format(
                new Date(message.createdAt?.toDate()),
                "yyyy年MM月dd日 H:mm",
                { locale: ja }
              )}
            </span>
          </h4>
          <div>
            {auth.currentUser === null ? (
              <div className={classes.no_user_modal_container}>
                <NoAuthUserText name="詳細" />
              </div>
            ) : (
              <>
                <Button
                  id="basic-button"
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{ fontSize: "14px", marginLeft: "20px" }}
                >
                  詳細
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={messageDelete}
                    disabled={auth.currentUser.uid !== message.uid}
                    style={{ color: "rgb(224, 33, 92)" }}
                  >
                    メッセージを削除する
                  </MenuItem>
                  <MenuItem
                    onClick={messageEdit}
                    disabled={auth.currentUser.uid !== message.uid}
                    style={{ color: "rgb(27, 196, 125)" }}
                  >
                    メッセージを編集する
                  </MenuItem>
                  <MenuItem onClick={handleReplyPage}>
                    メッセージに返信する
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
        {message.image && (
          <img src={message.image} alt="画像" className={classes.img} />
        )}
        {edit ? (
          <>
            <TextField
              multiline
              id="js-text"
              autoFocus
              fullWidth
              inputRef={editRef}
              maxRows={20}
              placeholder={"メッセージを作成"}
              className={classes.edit_textField}
              value={text}
              name="textarea"
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleEditCancel}
              className={classes.cancel_button}
            >
              {" "}
              キャンセル
            </button>
            <button
              onClick={handleEditUpdate}
              className={classes.update_button}
            >
              編集を保存する
            </button>
            <button
              onClick={handleShowEmojis}
              className={classes.emojiIcon_button}
            >
              <TagFacesIcon color="primary" className={classes.emojiIcon} />
            </button>
            <div
              className={`${classes.emoji} ${!showEmojis && classes.hidden}`}
            >
              <Emoji pickEmoji={pickEmoji} />
            </div>
          </>
        ) : (
          <>
            <p
              className={classes.message_text}
              dangerouslySetInnerHTML={{
                __html: filterXSS(htmlText, {
                  whiteList: {
                    a: ["href", "title", "target", "rel"],
                  },
                }),
              }}
            />
            <div className={classes.sub_function_wrapper}>
              <div>
                {auth.currentUser === null ? (
                  <ChatBubbleOutlineIcon
                    className={`${classes.message_icon}`}
                    onClick={HandleOpenNoAuthUserModal}
                  />
                ) : (
                  <ChatBubbleOutlineIcon
                    className={`${classes.message_icon} ${
                      countMessage &&
                      countMessage.length !== 0 &&
                      classes.count_message_icon
                    }`}
                    onClick={handleReplyPage}
                  />
                )}

                <span>
                  {countMessage && countMessage.length === 0
                    ? ""
                    : countMessage && countMessage.length}
                </span>
              </div>
              <div>
                {auth.currentUser === null ? (
                  <FavoriteBorderIcon
                    className={classes.like_icon}
                    onClick={HandleOpenNoAuthUserModal}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className={`${classes.like_icon} ${
                      userLikes &&
                      userLikes.includes(auth.currentUser.uid) &&
                      classes.selected_icon
                    }`}
                    onClick={handleLike}
                  />
                )}
                <span>
                  {userLikes && userLikes.length === 0
                    ? ""
                    : userLikes && userLikes.length}
                </span>
              </div>
            </div>
          </>
        )}
        <NoAuthUserIcon
          openNoAuthUserModal={openNoAuthUserModal}
          setOpenNoAuthUserModal={setOpenNoAuthUserModal}
          HandleOpenNoAuthUserModal={HandleOpenNoAuthUserModal}
          HandleCloseNoAuthUserModal={HandleCloseNoAuthUserModal}
        />
        <UserDetailModal
          handleClose={handleModalClose}
          message={message}
          open={openIcon}
        />
      </div>
    </>
  );
};

export default MessageHome;
