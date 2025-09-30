import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../assets/LOGO_rectangular.png";

const vibration = {
  vibrate: {
    x: [0, -2, 2, -2, 0],
    y: [0, 1, -1, 1, 0],
    transition: { duration: 0.3, repeat: Infinity, repeatDelay: 5 },
  },
};

function Logo() {
  return (
    <div className="logo-container">
      <Link to="/" className="logo-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <motion.img
          src={logo}
          alt="J SPORT logo"
          className="logo-image"
          variants={vibration}
          animate="vibrate"
        />
        <motion.p
          className="logo-text"
          variants={vibration}
          animate="vibrate"
        >
          J SPORT
        </motion.p>
      </Link>
    </div>
  );
}

export default Logo;