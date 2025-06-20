"use client";

import { useState, useEffect } from "react";

export function useDarkMode(): [boolean, () => void] {
  const [isDarkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const theme = localStorage.getItem("theme");
    return theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setDarkMode(prevIsDark => {
      const newIsDark = !prevIsDark;
      localStorage.setItem("theme", newIsDark ? "dark" : "light");
      return newIsDark;
    });
  };

  useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
          if (localStorage.getItem('theme') === null) {
              setDarkMode(mediaQuery.matches);
          }
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return [isDarkMode, toggleDarkMode];
}
