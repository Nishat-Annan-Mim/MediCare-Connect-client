"use client";

import { useState, useEffect } from "react";

const THEME_KEY = "medicare-theme";

export function useTheme() {
  const [theme, setTheme] = useState("medicareLight");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    const initial = stored || "medicareLight";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "medicareLight" ? "medicareDark" : "medicareLight";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
  };

  return { theme, toggleTheme, isDark: theme === "medicareDark" };
}