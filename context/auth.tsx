import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import Loading from "../components/Loading";

export const AuthContext = createContext(null);

const AuthProvider: React.FC = (props) => {
  const { children } = props;
  const [user, setUser] = useState<object>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
