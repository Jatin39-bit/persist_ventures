
import { createContext, useState, useContext } from "react";

export const MemeContext = createContext();

export function MemeProvider({ children }) {
  const [url, setUrl] = useState("");
  return (
    <MemeContext.Provider value={{ url, setUrl }}>
      {children}
    </MemeContext.Provider>
  );
}

export function useMeme() {
  return useContext(MemeContext);
}
