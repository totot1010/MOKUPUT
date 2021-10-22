import React, { useState } from "react";
import { db, signupWithEmailAndPassword } from "../firebase/firebase";
import Link from "next/link";
import Router from "next/router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const signup = async (e) => {
    e.preventDefault();
    const user = await signupWithEmailAndPassword(email, password);
    const newUserId = user.user.uid;
    await firestoreAdd(newUserId);
    await user && Router.push(`/signup/${newUserId}`);

    setEmail("");
    setPassword("");
  };

  const firestoreAdd = (id) => {
    db.collection("users").doc(id).set({
      email: email,
    });
  };

  return (
    <>
      <form onSubmit={signup}>
        <input
          placeholder="メールアドレス"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type={"submit"}>登録</button>
      </form>
      <div style={{ display: "flex" }}>
        <h1>続けてログインする</h1>
        <button style={{ cursor: "pointer", marginTop: "16px" }}>
          <Link href="/signin">ログインページへ</Link>
        </button>
      </div>
    </>
  );
};

export default Signup;

export const getStaticProps = async () => {
  return {
    props: {},
  };
};
