"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
} | null;

const ThemeContext = createContext<ThemeContextType>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, toggleDarkMode]: [boolean, () => void] = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
