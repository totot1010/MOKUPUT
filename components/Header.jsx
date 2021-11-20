import React, { useState, useCallback, useContext, useEffect } from "react";
import { db, auth, storage } from "../firebase/firebase";
import { AuthContext } from "../context/auth";
import classes from "../styles/Header.module.scss";

import Camera from "./svg/Camera";
import Delete from "./svg/Delete";

import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import algoliasearch from "algoliasearch";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const ALGOLIA_INDEX_NAME = "study-app";

const client = algoliasearch("77WZ20O6OE", "60af8ce0883b0f3a5ae5612e6bbf239f");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const Header = (props) => {
  const { onSearch, setSearchUsers, searchText, setSearchText } = props;
  const { user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedExperience, setSelectedExperience] = useState();
  const [selectedUseLanguage, setSelectedUseLanguage] = useState([]);
  const [selectedWillLanguage, setSelectedWillLanguage] = useState("");
  const [selectedAvatarURL, setSelectedAvatarURL] = useState();
  const [selectedAvatarPath, setSelectedAvatarPath] = useState();
  const [open, setOpen] = useState(false);
  const [openSearchCancel, setOpenSearchCancel] = useState();
  const [alertOpen, setAlertOpen] = useState(false);
  const [img, setImg] = useState("");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    const docRef = db.collection("users").doc(user.uid);
    docRef.get().then(function (doc) {
      if (doc.exists) {
        setSelectedName(doc.data().name);
        setSelectedExperience(doc.data().experience);
        setSelectedUseLanguage(doc.data().useLanguage);
        setSelectedWillLanguage(doc.data().willLanguage);
        setSelectedAvatarURL(doc.data().avatarURL);
        setSelectedAvatarPath(doc.data().avatarPath);
      }
    });
  }, []);

  useEffect(() => {
    if (img) {
      const uploadImg = async () => {
        const storageRef = storage.ref();
        const imagesRef = storageRef.child(
          `avatar/${new Date().getTime()} - ${img.name}`
        );

        try {
          if (selectedAvatarPath) {
            await storageRef.child(selectedAvatarPath).delete();
          }
          const snap = await imagesRef.put(img);
          await snap.ref.getDownloadURL().then(function (URL) {
            setSelectedAvatarURL(URL);
            setSelectedAvatarPath(snap.ref.fullPath);
          });
          setImg("");
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  //言語の種類
  const names = [
    "HTML",
    "CSS",
    "JavaScript",
    "Java",
    "PHP",
    "Ruby",
    "React",
    "Python",
    "Go",
    "C",
    "C#",
    "C++",
    "Rust",
    "Swift",
    "TypeScript",
    "SQL",
    "Node.js",
    "VBA",
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const profileClick = () => {
    setOpen(true);
  };
  const handleClose = useCallback(() => setOpen(false), []);

  const handleChangeLanguage = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedUseLanguage(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleChangeWillLanguage = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedWillLanguage(
      typeof value === "string" ? value.split(",") : value
    );
  };

  //ユーザーアイコンを削除した時に挙動
  const deleteImage = async () => {
    const confirm = window.confirm(
      "プロフィール画像を削除してよろしいですか？"
    );
    if (confirm) {
      const storageRef = storage.ref();
      await storageRef.child(selectedAvatarPath).delete();

      await db.collection("users").doc(user.uid).update({
        avatarURL: "",
        avatarPath: "",
      });
      await setSelectedAvatarURL("");
      await setSelectedAvatarPath("");
    }
  };

  //プロフィール編集の保存ボタンを押した時の挙動
  const profileSave = async () => {
    await setAlertOpen(true);
    await db.collection("users").doc(user.uid).set(
      {
        name: selectedName,
        experience: selectedExperience,
        useLanguage: selectedUseLanguage,
        willLanguage: selectedWillLanguage,
        avatarPath: selectedAvatarPath,
        avatarURL: selectedAvatarURL,
      },
      { merge: true }
    );
    await setOpen(false);
  };

  const handleOpenSearchCancel = () => {
    setOpenSearchCancel(true);
  };

  //検索フォームの✖ボタンを押した時の挙動
  const searchCancel = () => {
    setSearchText("");
    setSearchUsers("");
    setOpenSearchCancel(false);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={profileClick}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setAlertOpen(false)}
        >
          <Alert severity="success">プロフィールを更新しました!</Alert>
        </Snackbar>
      </Stack>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ height: "64px" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              MOKUPUT
            </Typography>
            <AccessTimeIcon className={classes.access_time} />
            <Search className={classes.search_wrapper}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchText}
                onChange={onSearch}
                onClick={handleOpenSearchCancel}
              />
              {openSearchCancel && searchText ? (
                <>
                  <Button onClick={searchCancel} style={{ padding: "0" }}>
                    <CloseIcon style={{ color: "white" }} />
                  </Button>
                </>
              ) : null}
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box className={classes.box}>
          <Typography variant="h6" className={classes.title}>
            プロフィール編集
            <button className={classes.saveButton} onClick={profileSave}>
              保存
            </button>
            <CloseIcon
              fontSize="large"
              className={classes.closeIcon}
              onClick={handleClose}
            />
          </Typography>
          <div className={classes.profile}>
            <div className={classes.img_container}>
              <Avatar className={classes.image} src={selectedAvatarURL} />
              <div className={classes.overlay}>
                <div style={{ display: "flex" }}>
                  <label htmlFor="photo">
                    <Camera />
                  </label>
                  {selectedAvatarURL ? (
                    <Delete deleteImage={deleteImage} />
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    id="photo"
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          <Typography className={classes.typograpphy_name}>名前</Typography>
          <Stack spacing={2}>
            <form className={classes.nameForm}>
              <input
                className={classes.nameText}
                type="text"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              />
            </form>
            <Typography className={classes.typography}>実務経験</Typography>
            <FormControl component="fieldset" sx={{ ml: 3 }}>
              <FormLabel component="legend"></FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="row-radio-buttons-group"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="あり"
                />
                <FormControlLabel value="no" control={<Radio />} label="なし" />
              </RadioGroup>
            </FormControl>
            <Typography className={classes.typography}>
              実務で使っている言語
            </Typography>
            <FormControl variant="standard" fullWidth sx={{ ml: 3 }}>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedUseLanguage}
                onChange={handleChangeLanguage}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={
                        selectedUseLanguage &&
                        selectedUseLanguage.indexOf(name) > -1
                      }
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography className={classes.typography}>勉強中の言語</Typography>
            <FormControl variant="standard" fullWidth sx={{ ml: 3 }}>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedWillLanguage}
                onChange={handleChangeWillLanguage}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox
                      checked={
                        selectedWillLanguage &&
                        selectedWillLanguage.indexOf(name) > -1
                      }
                    />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default Header;
