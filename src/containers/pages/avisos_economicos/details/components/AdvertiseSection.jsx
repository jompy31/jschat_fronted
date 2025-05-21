// frontend_abcupon/src/containers/pages/avisos_economicos/components/AdvertiseSection.jsx
import React from "react";
import 'boxicons';

const AdvertiseSection = ({ isMobile }) => (
  <div style={{
    textAlign: "center",
    padding: "20px",
    backgroundColor: '#f6f0d9',
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
    border: '1px solid #dcdcdc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: `'Times New Roman', Times, serif`,
    color: '#333',
  }}>
    <h1 style={{
      fontSize: isMobile ? "7.2vw" : "2.5vw",
      color: "black",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.5",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'}
    >
      <box-icon type='solid' name='megaphone'></box-icon>
      ¡Anúnciate con Nosotros!
    </h1>
    <p style={{
      fontSize: "1.2vw",
      marginBottom: "15px",
      lineHeight: "1.6",
      color: "#555",
      display: "block",
      backgroundColor: "#f1f1f1",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      fontSize: "14px",
      lineHeight: "1.5",
      color: "#333",
      maxWidth: "100%",
      transition: "transform 0.2s ease",
    }}>
      Escribanos al Whatsapp: <span style={{ color: "#007bff", fontWeight: "bold" }}>☎️(506) 8788-6767</span>,
      Sinpe al <span style={{ color: "#007bff", fontWeight: "bold" }}>8974-1577</span>, Coopered R.L. Ofic. Uruca
      <span style={{ color: "#007bff", fontWeight: "bold" }}>☎️2220-2290</span>.
      Al transferir, pasa la captura del pago realizado para enviarte el formulario con los requisitos para facturación.
      Recuerda incluir en tu argumento de venta un diferenciador como propuesta de valor.
      ¡Anúnciate aquí! Cada 10 palabras por 7 días por solo <span style={{ color: "#dc3545" }}>₡10,000</span>, pautadas en redes sociales y promocionadas en Facebook.
      Imagen adicional por <span style={{ color: "#dc3545" }}>₡3,000</span>. Cada 3 sílabas cuentan como una palabra. No cuenta título, teléfono del proveedor, ubicación de zona (no es dirección), ni enlace de WhatsApp.
      Landín Page solo para proveedores y usuarios de Publicombo en el directorio telefónico comercial ABcupon.com.
    </p>
  </div>
);

export default AdvertiseSection;