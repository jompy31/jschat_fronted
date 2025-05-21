// frontend_abcupon/src/containers/pages/avisos_economicos/components/ScrollToTopButton.jsx
import React from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = ({ isMobile, setFilteredClasificados }) => {
  const handleScrollToTop = () => {
    setFilteredClasificados([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      position: "fixed",
      bottom: "20px",
      zIndex: 1000,
      width: "auto",
    }}>
      <div
        style={{
          backgroundColor: "blue",
          color: "white",
          padding: isMobile ? "8px" : "10px",
          borderRadius: "50%",
          cursor: "pointer",
          width: isMobile ? "45px" : "50px",
          height: isMobile ? "45px" : "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleScrollToTop}
      >
        <FaArrowUp size={isMobile ? 20 : 30} />
      </div>
    </div>
  );
};

export default ScrollToTopButton;