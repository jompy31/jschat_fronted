// frontend_abcupon/src/containers/pages/avisos_economicos/components/Header.jsx
import React from "react";
import logo from "../../../../../assets/categorias/25.webp";

const Header = ({ isMobile }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    marginTop: "10%",
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        rgba(0, 0, 0, 0.05) 0px,
        rgba(0, 0, 0, 0.05) 2px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(0, 0, 0, 0.05) 0px,
        rgba(0, 0, 0, 0.05) 2px,
        transparent 2px,
        transparent 4px
      )
    `,
    border: "2px solid black",
    borderRadius: "15px",
    padding: "5px",
    width: "90vw",
    margin: "auto",
    minWidth: "max-content",
  }}>
    <img
      src={logo}
      alt="Logo Izquierdo"
      style={{
        maxWidth: "25%",
        maxHeight: "30vh",
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
    <div style={{ textAlign: "center", flex: 1, minWidth: "max-content" }}>
      <h2 style={{
        color: "black",
        fontWeight: "bold",
        textTransform: "none",
        fontSize: "5.2vw",
        whiteSpace: "nowrap",
      }}>
        <span style={{ fontSize: "6.0vw" }}>Avisos</span>
        <span style={{ fontSize: "6.0vw", marginLeft: "1.6vw" }}>Económicos</span>
      </h2>
    </div>
  </div>
);

export default Header;