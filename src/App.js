import React, { useEffect } from "react";
import "./App.css";
import useLocalStorage from "use-local-storage";
import AppRoutes from "./routes/Routes";
import Navbar from "../src/components/navigation/Navbar/index"; // 👈 Asegúrate de esta ruta

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  // 🔥 Mantiene sincronizado el tema global (html, body y App)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const app = document.querySelector(".App");

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      body.classList.add("dark");
      body.classList.remove("light");
      app?.classList.add("dark");
      app?.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      body.classList.remove("dark");
      body.classList.add("light");
      app?.classList.remove("dark");
      app?.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // 🔄 Escucha cambios del sistema y aplica el tema dinámicamente
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setIsDark]);

  return (
    <div className={`App ${isDark ? "dark" : "light"}`} style={{ lineHeight: "1.5" }}>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <AppRoutes />
    </div>
  );
}

export default App;
