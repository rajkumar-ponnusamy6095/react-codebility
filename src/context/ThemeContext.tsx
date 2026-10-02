import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_THEME,
  themes,
  type ThemeName,
} from "../themes/themes";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem(
      "app-theme"
    ) as ThemeName | null;

    if (
      savedTheme &&
      Object.hasOwn(themes, savedTheme)
    ) {
      return savedTheme;
    }

    return DEFAULT_THEME;
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}