import React from 'react';
import './App.css';
import useLocalStorage from 'use-local-storage';
import Routes from './routes/Routes';
import { Toggle } from "./components/darkmode/Toggle";

function App() {
  const preference = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setIsDark] = useLocalStorage('isDark', preference);

  const handleChange = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`App ${isDark ? 'dark' : 'light'}`} data-theme={isDark ? 'dark' : 'light'} style={{lineHeight: "1.5"}}>
      {/* Agregar una clase toggle-container */}
      {/* <div className="toggle-container">
        <Toggle handleChange={handleChange} isChecked={isDark} />
      </div> */}
      <Routes />
    </div>
  );
}

export default App;
