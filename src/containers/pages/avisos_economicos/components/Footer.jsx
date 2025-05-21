// frontend_abcupon/src/containers/pages/avisos_economicos/components/Footer.jsx
import React from "react";

const Footer = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  }}>
    <span style={{
      display: "block",
      backgroundColor: "#f1f1f1",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: " fcenter",
      fontSize: "0.8em",
      lineHeight: "1.5",
      color: "#333",
      maxWidth: "100%",
      transition: "transform 0.2s ease",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'}
    >
      <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
      San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
      WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
      Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
    </span>
  </div>
);

export default Footer;