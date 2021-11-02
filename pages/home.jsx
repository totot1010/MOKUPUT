import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebase/firebase";
import Header from "../components/Header";
import SearchUsers from "../components/SearchUsers";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";

import classes from '../styles/home.module.scss'


import algoliasearch from "algoliasearch";


const ALGOLIA_INDEX_NAME = "study-app";
const client = algoliasearch("77WZ20O6OE", "60af8ce0883b0f3a5ae5612e6bbf239f");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "",
}));

const Home = () => {
  const [searchUsers, setSearchUsers] = useState([]);

  const onSearch = async (e) => {
    if (e.target.value === "") return setSearchUsers([]);
    await index
      .search(e.target.value, {
        attributesToHighlight: [],
      })
      .then(({ hits }) => {
        setSearchUsers(hits);
      });
  };

console.log(auth.currentUser.uid)

  return (
    <>
      <Header onSearch={onSearch} />
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {searchUsers.map((user) => {
          return (
            <SearchUsers
              key={user.objectID}
              id={user.objectID}
              image={user.image}
              name={user.name}
              useLanguage={user.useLanguage}
              willLanguage={user.willLanguage}
            />
          );
        })}
      </List>
    </>
  );
};

export default Home;
