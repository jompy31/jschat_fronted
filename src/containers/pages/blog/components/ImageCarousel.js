import React from "react";
import { Image } from "react-bootstrap";
import publicidad1 from "../../../../assets/catalogo/webp/publicidad1.webp";
import publicidad2 from "../../../../assets/publicidad 2.png";
import publicidad3 from "../../../../assets/catalogo/webp/publicidad3.webp";

const ImageCarousel = ({ index, scrollPosition }) => {
  const images = [publicidad1, publicidad2, publicidad3];

  return (
    <div
      style={{
        width: "50%",
        marginLeft: "3%",
        overflow: "hidden",
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "column",
        transition: "transform 6s ease",
        transform: `translateY(-${index * 100}%) translateY(${scrollPosition}px)`,
      }}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      {images.map((image, i) => (
        <Image
          key={i}
          src={image}
          alt={`Cooperative Image ${i + 1}`}
          style={{
            maxHeight: "30%",
            maxWidth: "100%",
            marginBottom: "10px",
          }}
        />
      ))}
    </div>
  );
};

export default ImageCarousel;