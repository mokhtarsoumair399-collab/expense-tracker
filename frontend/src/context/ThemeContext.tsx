import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const reducer = (state: Theme): Theme => (state === "dark" ? "light" : "dark");

const initialTheme = (): Theme => (localStorage.getItem("theme") as Theme) || "light";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, toggleTheme] = useReducer(reducer, undefined, initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
