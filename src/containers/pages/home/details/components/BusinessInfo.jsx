import React from "react";
import Publicidad from "../../../../../assets/catalogo/webp/visibilidad.webp";
import { openURL } from "../utils/formatUtils";

const BusinessInfo = ({ subproductData, isMobile, isMini }) => {
  // Define logo styles based on device type
  const logoStyles = {
    maxWidth: isMobile ? "100%" : "50%", // Full width on mobile, 50% on desktop
    maxHeight: isMobile ? "40vw" : "40vh", // Smaller height on mobile
    width: "auto", // Maintain aspect ratio
    height: "auto", // Maintain aspect ratio
    border: "2px solid red",
    boxShadow: "0 0 10px black",
    borderRadius: "10px",
  };

  return (
    <div
      style={{
        border: "2px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "5px 5px 10px #888888",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        marginBottom: "20px",
        lineHeight: "1.5",
      }}
    >
      {subproductData.logo ? (
        <img
          src={subproductData.logo}
          alt={`Logo de ${subproductData.name}`}
          style={logoStyles}
        />
      ) : (
        <img
          src={Publicidad}
          alt={`Publicidad de ${subproductData.name} en ABCupon`}
          style={logoStyles}
        />
      )}
      <h1
        style={{
          fontSize: "3em",
          color: "red",
          textShadow: "2px 2px 4px #000",
          fontWeight: "bold",
          marginBottom: "10px",
          marginTop: "10px",
          textAlign: "left",
        }}
      >
        {subproductData.name}
      </h1>
      <h3
        style={{
          fontSize: "2em",
          color: "red",
          textShadow: "2px 2px 2px #000",
          fontWeight: "bold",
          marginTop: "0px",
          marginBottom: "20px",
          textAlign: "left",
        }}
      >
        {subproductData.comercial_activity}
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "2rem",
          backgroundColor: "#f4f4f4",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: isMobile ? "100%" : "80%",
          margin: "0 auto",
          lineHeight: "1.5",
        }}
      >
        <p
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          <strong>Correo:</strong>{" "}
          {isMobile && subproductData.email.length > 50
            ? subproductData.email
                .match(/.{1,50}/g)
                .map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))
            : subproductData.email}
        </p>
        <p
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
          }}
        >
          <strong>Teléfono:</strong>{" "}
          {subproductData.phone
            ?.replace(/\s+/g, "")
            .replace(/^(\d{4})(\d{0,4})$/, "$1-$2") || "N/A"}
        </p>
        <div
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
            textAlign: "justify",
          }}
        >
          <strong>Descripción:</strong>
          <ul
            style={{
              paddingLeft: "1.2em",
              marginTop: "0.5rem",
              listStyleType: "disc",
              lineHeight: "1.6",
            }}
          >
            {subproductData.description ? (
              subproductData.description
                .split(/\n+/)
                .map((sentence, index) => {
                  if (
                    sentence.includes("Paquete Básico") ||
                    sentence.includes("¿Cómo contratar?") ||
                    sentence.includes("¿Cómo funciona?") ||
                    sentence.includes("Condiciones:") ||
                    sentence.includes("Las 24 Categorías para Anunciarte:") ||
                    sentence.includes("¡Anúnciate hoy!")
                  ) {
                    return (
                      <li
                        key={index}
                        style={{
                          marginBottom: "0.5rem",
                          listStyleType: "none",
                        }}
                      >
                        <strong>{sentence.trim()}</strong>
                      </li>
                    );
                  } else if (sentence.trim() === "") {
                    return null;
                  } else {
                    return (
                      <li key={index} style={{ marginBottom: "0.5rem" }}>
                        {sentence.trim()}
                      </li>
                    );
                  }
                })
            ) : (
              <li>
                ¿Deseas rellenar con la información de su negocio? Contacténos al
                8687-6767
              </li>
            )}
          </ul>
        </div>
        <div
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
            marginRight: "32%",
            lineHeight: "1.5",
          }}
        >
          <p>
            <strong>Contacto:</strong> {subproductData.contact_name}
          </p>
        </div>
        <p
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
            lineHeight: "1.5",
          }}
        >
          <strong>País:</strong> {subproductData.country}
        </p>
        <p
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
            marginRight: "24%",
          }}
        >
          <strong>Método de Pago:</strong> {subproductData.pay_method}
        </p>
        <p
          style={{
            fontSize: isMobile ? "1.0em" : "1.2em",
            cursor: "pointer",
            marginRight: "40%",
            color: "#007bff",
            textDecoration: "underline",
            wordBreak: "break-word",
            maxWidth: isMobile ? "90%" : "100%",
            whiteSpace: "normal",
          }}
          onClick={() => openURL(subproductData.url)}
        >
          <strong>URL: </strong>
          {subproductData.url}
        </p>
        <p
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
            marginRight: "24%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <strong>Certificado y con depósito de garantía: </strong>
          {subproductData.certified ? (
            <span
              style={{
                marginLeft: "10px",
                width: "20px",
                height: "20px",
                border: "2px solid #4CAF50",
                borderRadius: "4px",
                display: "inline-block",
                backgroundColor: "#4CAF50",
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                ✔
              </span>
            </span>
          ) : (
            <span
              style={{
                marginLeft: "10px",
                width: "20px",
                height: "20px",
                border: "2px solid #ccc",
                borderRadius: "4px",
                display: "inline-block",
              }}
            />
          )}
        </p>
        {!subproductData.certified && (
          <p style={{ marginTop: "0.5rem", marginBottom: "1rem", color: "#333" }}>
            ¿Quieres ser un proveedor certificado? Consulta al{" "}
            <strong>8788-6767</strong> cómo ser proveedor certificado de ABCupon.
          </p>
        )}
        <p
          style={{
            fontSize: "1.2em",
            marginBottom: "1rem",
            color: "#333",
            marginRight: "24%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {subproductData.point_of_sale ? (
            <>
              <strong>Punto de venta certificado: </strong>
              <span
                style={{
                  marginLeft: "10px",
                  width: "20px",
                  height: "20px",
                  border: "2px solid #4CAF50",
                  borderRadius: "4px",
                  display: "inline-block",
                  backgroundColor: "#4CAF50",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  ✔
                </span>
              </span>
            </>
          ) : (
            <>
              <strong>Punto de venta: </strong>
              <span
                style={{
                  marginLeft: "10px",
                  width: "20px",
                  height: "20px",
                  border: "2px solid #ccc",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              />
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default BusinessInfo;