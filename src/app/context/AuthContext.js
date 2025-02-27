"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userr, setUserr] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = cookies.get("token") || localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          setUserr(res.data.user);
          setLoggedIn(true);
        })
        .catch((err) => {
          console.log(err);
          setLoggedIn(false);
          setUserr(null);
          cookies.remove("token");
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userr, setUserr, loggedIn, setLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
