import React from "react";
import image1 from "../../../../assets/categorias/2.webp";
import image2 from "../../../../assets/categorias/25.webp";

const HeaderImages = ({ isMobile }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
      height: isMobile ? "0%" : "20vh",
      marginBottom: "var(--marginBottom)",
      marginLeft: "5.3%",
      gap: isMobile ? "2vh" : "5vh",
    }}
  >
    <img
      src={image1}
      alt="Imagen 1"
      style={{
        maxWidth: isMobile ? "25%" : "50%",
        maxHeight: "100%",
        objectFit: "cover",
      }}
    />
    <img
      src={image2}
      alt="Imagen 2"
      style={{
        maxWidth: isMobile ? "25%" : "50%",
        maxHeight: "100%",
        objectFit: "cover",
      }}
    />
  </div>
);

export default HeaderImages;