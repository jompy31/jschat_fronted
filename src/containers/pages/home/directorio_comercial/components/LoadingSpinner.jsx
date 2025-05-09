import React from "react";

const LoadingSpinner = () => (
  <div style={{ textAlign: "center", margin: "20px 0" }}>
    <div
      style={{
        border: "4px solid rgba(255, 0, 0, 0.2)",
        borderTop: "4px solid red",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 1s linear infinite",
        margin: "0 auto",
      }}
    />
    <p style={{ color: "red" }}>Cargando Directorio de Comercios...</p>
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

export default LoadingSpinner;