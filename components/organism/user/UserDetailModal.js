import React, {useState, useEffect} from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import classes from "../../../styles/organism/user/UserDetailModal.module.scss";

const UserDetailModal = (props) => {
  const {setOpen, open, user} = props
console.log(user)


  const handleClose = () => setOpen(false)

  return (
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.box}>
          <Typography variant="h6" className={classes.title}>
            ユーザー詳細
            <CloseIcon
              fontSize="large"
              className={classes.closeIcon}
              onClick={handleClose}
            />
          </Typography>
          <Stack spacing={2}>
            <Typography className={classes.typography}>名前</Typography>
            <Typography className={classes.input}>
              {/* {user.name} */}
            </Typography>
            <Typography className={classes.typography}>実務経験</Typography>
            <Typography className={classes.input}>
              {/* {user.experience} */}
            </Typography>
            <Typography className={classes.typography}>
              実務で使っている言語
            </Typography>
            <Typography className={classes.input}>{"aaa"}</Typography>
            <Typography className={classes.typography}>勉強中の言語</Typography>
            <Typography className={classes.input}>{"aaa"}</Typography>
         
          </Stack>
        </Box>
      </Modal>
  );
};

export default UserDetailModal;
