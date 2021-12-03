import React, { useState } from "react";
import classes from "../../styles/NoAuthUser/NoAuthUserText.module.scss";
import Link from "next/link";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// web.cjs is required for IE11 support
import { useSpring, animated } from "react-spring";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    in: openNoAuthUserModal,
    children,
    onEnter,
    onExited,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: openNoAuthUserModal ? 1 : 0 },
    onStart: () => {
      if (openNoAuthUserModal && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!openNoAuthUserModal && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

const NoAuthUserIcon = (props) => {
  const { openNoAuthUserModal, HandleCloseNoAuthUserModal } = props;
  return (
    <>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={openNoAuthUserModal}
        onClose={HandleCloseNoAuthUserModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openNoAuthUserModal}>
          <Box sx={style}>
            <Typography
              id="spring-modal-title"
              variant="h6"
              component="h2"
              sx={{ color: "rgba(0,0,0,0.8)" }}
            >
              新規登録・ログインのお願い
            </Typography>
            <Typography
              id="spring-modal-description"
              sx={{ mt: 2, color: "rgba(0,0,0,0.6)" }}
            >
              ログインすることでメッセージの送信やマイページの編集、通知機能などの基本操作が可能になります。
            </Typography>
            <div className={classes.button_container}>
              <Link href="/signin">
                <a>ログイン</a>
              </Link>
              <Link href="/signup">
                <a>新規登録</a>
              </Link>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default NoAuthUserIcon;
