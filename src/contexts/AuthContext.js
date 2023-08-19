
import { useState, useEffect, useContext, Children, createContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedin, setIsLoggedIn] = useState(false);

  const value = {
    authUser,
    setAuthUser,
    isLoggedin,
    setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={value} {...props}>
      {props.children}
    </AuthContext.Provider>
  );
}
