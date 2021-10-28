import React, { useState } from "react";
import { signinWithEmailAndPassword, signout, db } from "../firebase/firebase";
import Link from "next/link";
import Router from "next/router";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signin = async (e) => {
    e.preventDefault();
    const result = await signinWithEmailAndPassword(email, password);
    console.log(result.user.uid)
    await db.collection('users').doc(result.user.uid).update({isOnline: true});
    // await result && Router.push("/home");
  };

  return (
    <>
      <h1>ログインページ</h1>
      <form onSubmit={signin}>
        <input
          type="text"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type={"submit"}>ログイン</button>
      </form>
      <Link href="/signup">
        <a>新規登録へ</a>
      </Link>
      <div>
        <button onClick={signout}>ログアウト</button>
      </div>
    </>
  );
};

export default Signin;
