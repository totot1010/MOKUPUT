import React, { useState } from "react";
import "firebase/firestore";
import { db } from "../firebase/firebase";

const Home = () => {
  const [fire, setFire] = useState([]);

  const handleClick = () => {
    const unSub = db.collection("users").onSnapshot((snapshot) => {
      setFire(
        snapshot.docs.map((doc) => ({
          age: doc.data().age,
          name: doc.data().name,
        }))
      );
    });
    return () => unSub();
  };

  console.log(fire);

  return (
    <>
      <h1>あああ</h1>
      <button onClick={handleClick}>取得</button>
    </>
  );
};

export default Home;
