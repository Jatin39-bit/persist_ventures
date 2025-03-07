
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    if (storedTheme) {
      setDarkMode(JSON.parse(storedTheme));
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newTheme));
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
