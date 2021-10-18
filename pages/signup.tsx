import React, { useState } from "react";
import {signupWithEmailAndPassword} from '../firebase/firebase'
import Link from 'next/link'

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    const user = await signupWithEmailAndPassword(email, password);
    console.log(user)
    setEmail("");
    setPassword("");
  };


  return (
    <div>
      <form onSubmit={signup}>
        <input
        placeholder='メールアドレス'
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder='パスワード'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type={'submit'}>登録</button>
      </form>
      <div style={{display: "flex"}}>
      <h1>続けてログインする</h1>
      <button style={{cursor: "pointer",marginTop: "16px"}}><Link href="/signin">ログインページへ</Link></button>
      </div>
    </div>
  );
};

export default Signup;
