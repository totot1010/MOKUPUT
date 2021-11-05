import React, { useState } from "react";
import { db } from "../firebase/firebase";

export const useAllUsers = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    await db.collection("users").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          avatarURL: doc.data().avatarURL,
          experience: doc.data().experience,
          name: doc.data().name,
          age: doc.data().age,
          useLanguage: doc.data().useLanguage,
          willLanguage: doc.data().willLanguage,
        }))
      );
    });
  };
  return { getUsers, users };
};
