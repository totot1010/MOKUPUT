import React, { useState } from "react";
import classes from "../../styles/home/home.module.scss";
import Header from "../../components/Header";
import Homebody from "../../components/home/Homebody";
import SearchUsers from "../../components/home/SearchUsers";
import { useRouter } from "next/router";
import algoliasearch from "algoliasearch";

const ALGOLIA_INDEX_NAME = "study-app";
const client = algoliasearch("77WZ20O6OE", "60af8ce0883b0f3a5ae5612e6bbf239f");
const index = client.initIndex(ALGOLIA_INDEX_NAME);

const ChannelId: React.FC = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchText, setSearchText] = useState<string>("");

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

  return (
    <>
      <Header
        onSearch={onSearch}
        setSearchUsers={setSearchUsers}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div className={classes.list}>
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
      <Homebody />
    </>
  );
};

export default ChannelId;
