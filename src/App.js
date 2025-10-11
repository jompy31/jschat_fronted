import React, { useEffect } from "react";
import "./App.css";
import useLocalStorage from "use-local-storage";
import AppRoutes from "./routes/Routes";
import Navbar from "../src/components/navigation/Navbar/index"; // 👈 Asegúrate de esta ruta

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  // Aplica tema global a <html> para CSS vars en toda la página
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Escucha cambios del sistema (solo si no hay preferencia guardada)
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
    <div
      className="App"
      style={{ lineHeight: "1.5" }}
    >
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <AppRoutes />
    </div>
  );
}

export default App;