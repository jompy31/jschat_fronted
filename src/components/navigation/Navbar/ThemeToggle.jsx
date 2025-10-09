import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Validación inicial robusta: revisa localStorage o el sistema
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // Si no hay tema guardado, detecta el del sistema
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Sincroniza la clase global y el localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Escucha cambios del sistema en tiempo real (opcional, no interfiere)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDarkMode((prev) => !prev)}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-inner">
        {darkMode ? <Moon className="theme-icon" /> : <Sun className="theme-icon" />}
      </div>
    </button>
  );
}

export default ThemeToggle;
