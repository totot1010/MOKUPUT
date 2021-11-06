import React, { useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebase/firebase";
import Header from "../components/Header";
import SearchUsers from "../components/SearchUsers";
import MessageForm from '../components/MessageForm/HomeForm'

import List from "@mui/material/List";

import classes from '../styles/home.module.scss'
import algoliasearch from "algoliasearch";


const ALGOLIA_INDEX_NAME = "study-app";
const client = algoliasearch("77WZ20O6OE", "60af8ce0883b0f3a5ae5612e6bbf239f");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const Home = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchText, setSearchText] = useState('')

  const onSearch = async (e) => {
    await setSearchText(e.target.value)
    if (e.target.value === "") return setSearchUsers([]);
    await index
    .search(e.target.value, {
      attributesToHighlight: [],
    })
    .then(({ hits }) => {
      setSearchUsers(hits);
    });
  };
  console.log(searchText)

console.log(auth.currentUser.uid)

  return (
    <>
      <Header onSearch={onSearch} setSearchUsers={setSearchUsers} searchText={searchText} setSearchText={setSearchText} />
      <List className={classes.list} sx={{ width: "100%", maxWidth: 400, bgcolor: "background.paper" }}>
        {searchUsers && searchUsers.map((user) => {
          return (
            <SearchUsers
              key={user.objectID}
              id={user.objectID}
              avatarURL={user.avatarURL}
              name={user.name}
              useLanguage={user.useLanguage}
              willLanguage={user.willLanguage}
            />
          );
        })}
      </List>
      
      <div>
      <MessageForm />
      </div>
    </>
  );
};

export default Home;
