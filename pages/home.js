import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import Header from "../components/Header";
import SearchUser from "../components/SearchUser";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";


import algoliasearch from "algoliasearch";

const ALGOLIA_INDEX_NAME = "study-app";

const client = algoliasearch("77WZ20O6OE", "60af8ce0883b0f3a5ae5612e6bbf239f");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const Home = () => {
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);
  console.log(users)

  useEffect(() => {
    db.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          age: doc.data().age,
          useLanguage: doc.data().useLanguage,
          willLanguage: doc.data().willLanguage,
        }))
      );
    });
  }, []);

  auth.onAuthStateChanged((user) => {
    if (user) {
      const uid = user.uid;
      console.log(`Id: ${uid}`);
    } else {
      console.log("userはいません");
    }
  });

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "",
  }));

  const onSearch = async (e) => {
    if (e.target.value === "") return setSearchUsers([]);
    await index
      .search(e.target.value, {
        attributesToHighlight: [],
      })
      .then(({ hits }) => {
        setSearchUsers(hits);
        console.log(hits);
      });
  };

  return (
    <>
      <Header onSearch={onSearch}/>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {searchUsers.map((user) => {
        return (
          <SearchUser
          key={user.objectID}
          image={user.image}
          age={user.age}
          name={user.name}
          useLanguage={user.useLanguage}
          willLanguage={user.willLanguage}
        />
        )
      })}
      </List>
    </>
  );
};

export default Home;
