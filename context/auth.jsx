import React, { createContext, useEffect, useState } from "react";
import {auth} from '../firebase/firebase'
import Loading from '../components/Loading';

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const { children } = props;
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true); //いつ使われるのか分からない

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
  },[]);
  if(loading) {

    return <Loading />

  }

  return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
