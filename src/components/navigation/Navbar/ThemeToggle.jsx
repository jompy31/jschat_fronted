// src/components/Navbar/ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-inner">
        {darkMode ? <Moon className="theme-icon" /> : <Sun className="theme-icon" />}
      </div>
    </button>
  );
}

export default ThemeToggle;
