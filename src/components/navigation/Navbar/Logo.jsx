import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../assets/imagenes/logo_abcupon.jpg";

const vibration = {
  vibrate: {
    x: [0, -2, 4, -4, 0],
    y: [0, 2, -4, 4, 0],
    transition: { duration: 0.2, repeat: Infinity, repeatDelay: 4.8 },
  },
};

function Logo() {
  return (
    <div className="flex-shrink-0">
      <Link to="/" className="flex flex-col items-center" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <motion.img
          src={logo}
          alt="ABCupon logo"
          className="h-20 w-50"
          variants={vibration}
          animate="vibrate"
        />
        <motion.p
          className="mt-[-10px] text-sm text-green-500"
          style={{ textShadow: "1px 1px 1px black" }}
          variants={vibration}
          animate="vibrate"
        >
          Ir a página principal
        </motion.p>
      </Link>
    </div>
  );
}

export default Logo;