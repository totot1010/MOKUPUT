import React, { useState, useEffect } from 'react'
import {db} from '../firebase/firebase'

const UserId = ({id}) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    db.collection("user").onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email
        }))
      );
    });
  }, []);

  return (
    <div>
      <h1>○必須か必須じゃないか</h1>
      <h1>○複数選択</h1>
      <h1>１．ユーザーネームは？？</h1>
      <form>
        <input type='text' />
      </form>
      <h1>２．年齢は？</h1>
      <form>
        <input type='text' />
      </form>
      <h1>３．実務経験は？？</h1>
      <form>
        <input type='text' />
      </form>
      <h1>４．実務で使っている言語は？？</h1>
      <form>
        <input type='text' />
      </form>
      <h1>５．これから勉強したい or 勉強中の言語は？？</h1>
      <form>
        <input type='text' />
      </form>
      <h1>６．趣味</h1>
      <form>
        <input type='text' />
      </form>
    </div>
  )
}

export default UserId


export const getStaticPaths = async () => {
  const snapshot = await db.collection("users").get();
  return {
    paths: snapshot.docs.map((doc) => ({
      params: {
        id: doc.id,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  return {
    props: { id },
  };
};