import React from "react";
import { Moon, Sun } from "lucide-react";

function ThemeToggle({ isDark, setIsDark }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-inner">
        {isDark ? <Moon className="theme-icon" /> : <Sun className="theme-icon" />}
      </div>
    </button>
  );
}

export default ThemeToggle;