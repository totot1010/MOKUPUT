import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase/firebase";
import Link from "next/link";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";

//言語を複数選択する時に、画面いっぱいに広がらないように
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
];

//挙動がイマイチ理解できていない。後回し
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const UserId = ({ id }) => {
  const [user, setUser] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState(false);
  const [useLanguageArray, setUseLanguageArray] = useState([]);
  const [willLanguageArray, setWillLanguageArray] = useState([]);
  const [users, setUsers] = useState([]);
  const theme = useTheme();

  //実務で使っている言語をstateで管理
  const handleChangeLanguage = (event) => {
    const {
      target: { value },
    } = event;
    setUseLanguageArray(typeof value === "string" ? value.split(",") : value);
  };

  //これから勉強する、勉強中の言語をstateで管理
  const handleChangeWillLanguage = (event) => {
    const {
      target: { value },
    } = event;
    setWillLanguageArray(typeof value === "string" ? value.split(",") : value);
  };

  //画面遷移時にFirestoreからデータを取ってくる
  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
        }))
      );
    });
  }, []);

  const handleChangeAge = (e) => {
    setAge(e.target.value);
  };
  const handleChangeExperience = (e) => {
    setExperience(e.target.value);
  };

  //firesotreにユーザーデータを保存
  const clickRegister = async () => {
    if (!user) return alert("ユーザーネームを登録してください");
    await db.collection("users").doc(id).update({
      name: user,
      age: age,
      experience: experience,
      useLanguage: useLanguageArray,
      willLanguage: willLanguageArray,
    });
  };

  return (
    <>
      <h1>やること</h1>
      <h3>○必須か必須じゃないか</h3>
      <h3>複数選択は３つまで</h3>
      <h3>○ユーザーネームのMin文字数、Max文字数</h3>
      <h1>１．ユーザーネームは？？</h1>
      <form>
        <TextField
          id="standard"
          label="User Name"
          type="text"
          value={user}
          variant="standard"
          fullWidth
          onChange={(e) => setUser(e.target.value)}
          sx={{ ml: 3 }}
        />
      </form>
      <h1>２．年齢は？</h1>
      <FormControl variant="standard" fullWidth sx={{ ml: 3 }}>
        <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={age}
          onChange={handleChangeAge}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={13}>13</MenuItem>
          <MenuItem value={14}>14</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={16}>16</MenuItem>
          <MenuItem value={17}>17</MenuItem>
          <MenuItem value={18}>18</MenuItem>
          <MenuItem value={19}>19</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={21}>21</MenuItem>
          <MenuItem value={22}>22</MenuItem>
          <MenuItem value={23}>23</MenuItem>
          <MenuItem value={24}>24</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={26}>26</MenuItem>
          <MenuItem value={27}>27</MenuItem>
          <MenuItem value={28}>28</MenuItem>
          <MenuItem value={29}>29</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={31}>31</MenuItem>
          <MenuItem value={32}>32</MenuItem>
          <MenuItem value={33}>33</MenuItem>
          <MenuItem value={34}>34</MenuItem>
          <MenuItem value={35}>35</MenuItem>
          <MenuItem value={36}>36</MenuItem>
          <MenuItem value={37}>37</MenuItem>
          <MenuItem value={38}>38</MenuItem>
          <MenuItem value={39}>39</MenuItem>
          <MenuItem value={40}>40</MenuItem>
          <MenuItem value={41}>41</MenuItem>
          <MenuItem value={42}>42</MenuItem>
          <MenuItem value={43}>43</MenuItem>
          <MenuItem value={44}>44</MenuItem>
          <MenuItem value={45}>45</MenuItem>
          <MenuItem value={46}>46</MenuItem>
          <MenuItem value={47}>47</MenuItem>
          <MenuItem value={48}>48</MenuItem>
          <MenuItem value={49}>49</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={51}>51</MenuItem>
          <MenuItem value={52}>52</MenuItem>
          <MenuItem value={53}>53</MenuItem>
          <MenuItem value={54}>54</MenuItem>
          <MenuItem value={55}>55</MenuItem>
          <MenuItem value={56}>56</MenuItem>
          <MenuItem value={57}>57</MenuItem>
          <MenuItem value={58}>58</MenuItem>
          <MenuItem value={59}>59</MenuItem>
          <MenuItem value={60}>60</MenuItem>
        </Select>
      </FormControl>
      <h1>３．実務経験は？？</h1>
      <FormControl component="fieldset" sx={{ ml: 3 }}>
        <FormLabel component="legend">Practical Experience</FormLabel>
        <RadioGroup
          row
          aria-label="gender"
          name="row-radio-buttons-group"
          value={experience}
          onChange={handleChangeExperience}
        >
          <FormControlLabel value="true" control={<Radio />} label="あり" />
          <FormControlLabel value="false" control={<Radio />} label="なし" />
        </RadioGroup>
      </FormControl>
      <h1>４．実務で使っている言語は？？</h1>
      <FormControl variant="standard" fullWidth sx={{ ml: 3 }}>
        <InputLabel id="demo-multiple-checkbox-label">
          Programming language used in practice
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={useLanguageArray}
          onChange={handleChangeLanguage}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={useLanguageArray.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <h1>５．これから勉強したい or 勉強中の言語は？？</h1>
      <FormControl variant="standard" fullWidth sx={{ ml: 3 }}>
        <InputLabel id="demo-multiple-checkbox-label">
          Programming language you are studying or you want to study from now on
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={willLanguageArray}
          onChange={handleChangeWillLanguage}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={willLanguageArray.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        disableElevation
        onClick={clickRegister}
        sx={{ ml: 3 }}
      >
        <Link href="/signin">ユーザー登録完了</Link>
      </Button>
    </>
  );
};

export default UserId;

export const getStaticPaths = async () => {
  const snapshot = await db.collection("users").get();
  return {
    paths: snapshot.docs.map((doc) => ({
      params: {
        id: doc.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  return {
    props: { id },
  };
};
