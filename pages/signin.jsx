import React, { useState } from "react";
import { signinWithEmailAndPassword, signout, db } from "../firebase/firebase";
import Link from "next/link";
import Router from "next/router";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false)

  const signin = async (e) => {
    setloading(true)
    e.preventDefault();
    const result = await signinWithEmailAndPassword(email, password);
    console.log(result.user.uid)
    await db.collection('users').doc(result.user.uid).update({isOnline: true});
    await result && Router.push("/");
    setloading(false)
  };

  return (
    <>
     <div>
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
        <button type={"submit"}>{loading ? 'loading now...' : 'login'}</button>
      </form>
      <Link href="/signup">
        <a>新規登録へ</a>
      </Link>
      <div>
        <button onClick={signout}>ログアウト</button>
      </div>
       </div>
    </>
  );
};

export default Signin;
