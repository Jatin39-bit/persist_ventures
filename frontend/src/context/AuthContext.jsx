

import { createContext, useContext, useState } from "react";
import axios from "axios";
import cookies from "js-cookie";
import { useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userr, setUserr] = useState(localStorage.getItem("user"));
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = cookies.get("token") || localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserr(res.data);
          setLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.log(err);
          setLoggedIn(false);
          setUserr(null);
          localStorage.removeItem("user");
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
