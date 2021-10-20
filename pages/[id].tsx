import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";

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

// import { Checkbox, CheckboxGroup } from '@chakra-ui/core';

const UserId = ({ id }) => {
  const [user, setUser] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState(false);
  const [useLanguage, setUseLanguage] = useState("");
  const [willLanguage, setWillLanguage] = useState("");
  const [users, setUsers] = useState([]);

  console.log(users);
  // console.log(user);
  // console.log(age);
  // console.log(experience)
  // console.log(useLanguage);
  // console.log(willLanguage);

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
  const handleChangeLanguage = (e) => {
    setUseLanguage(e.target.value);
  };
  const handleChangeExperience = (e) => {
    setExperience(e.target.value);
  };
  const handleChangeWillLanguage = (e) => {
    setWillLanguage(e.target.value);
  };

  const clickRegister = async () => {
    await db.collection("users").doc(id).update({
      user: user,
      age: age,
      experience: experience,
      useLanguage: useLanguage,
      willLanguage: willLanguage,
    });
  };

  return (
    <div>
      <h1>○必須か必須じゃないか</h1>
      <h1>○複数選択</h1>
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
        <InputLabel id="demo-simple-select-standard-label">
          Programming language used in practice
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={useLanguage}
          onChange={handleChangeLanguage}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="HTML">HTML</MenuItem>
          <MenuItem value="CSS">CSS</MenuItem>
          <MenuItem value="JavaScript">JavaScript</MenuItem>
        </Select>
      </FormControl>
      <h1>５．これから勉強したい or 勉強中の言語は？？</h1>
      <FormControl variant="standard" fullWidth sx={{ ml: 3 }}>
        <InputLabel id="demo-simple-select-standard-label">
          Programming language used in practice
        </InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={willLanguage}
          onChange={handleChangeWillLanguage}
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="HTML">HTML</MenuItem>
          <MenuItem value="CSS">CSS</MenuItem>
          <MenuItem value="JavaScript">JavaScript</MenuItem>
          <MenuItem value="React">React</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" disableElevation onClick={clickRegister}>
        ユーザー登録完了
      </Button>
      {/* <CheckboxGroup
        isInline
        spacing={8}
        variantColor='teal'
        defaultValue={['itachi', 'kisame']}
      >
        <Checkbox value='itachi'>Itachi</Checkbox>
        <Checkbox value='madara'>Madara</Checkbox>
        <Checkbox value='kisame'>Kisame</Checkbox>
      </CheckboxGroup> */}
    </div>
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
