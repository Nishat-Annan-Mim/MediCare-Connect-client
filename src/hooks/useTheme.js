"use client";

import { useState, useEffect } from "react";

const THEME_KEY = "medicare-theme";

export function useTheme() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const current =
      document.documentElement.getAttribute("data-theme") || "medicareLight";
    setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "medicareDark" ? "medicareLight" : "medicareDark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  };

  return {
    theme: theme || "medicareLight",
    toggleTheme,
    isDark: theme === "medicareDark",
  };
}
