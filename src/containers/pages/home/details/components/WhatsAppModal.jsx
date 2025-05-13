import React, { useState } from "react";
import Modal from "react-modal";


const WhatsAppModal = ({
  subproductData,
  services,
  subCombos,
  quantities,
  comboQuantities,
  calculateSubtotal,
  calculateComboSubtotal,
  calculateTotal,
  calculateTotalCombos,
}) => {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const openWhatsAppModal = () => setShowWhatsAppModal(true);
  const closeWhatsAppModal = () => setShowWhatsAppModal(false);

  const sendWhatsAppMessage = () => {
    if (!subproductData || !subproductData.phone_number) {
      alert("Número de teléfono no disponible. Por favor, contacte al soporte.");
      return;
    }
    const selectedServices = services.filter(
      (service) => quantities[service.id] > 0
    );
    const selectedCombos = subCombos.filter(
      (combo) => comboQuantities[combo.id] > 0
    );

    if (selectedServices.length > 0 || selectedCombos.length > 0) {
      const message = `Nombre: ${name}\nApellido: ${lastName}\nCorreo: ${email}\nConsulta: ${consulta}\n\n`;
      const servicesMessage = selectedServices.map(
        (service) =>
          `${quantities[service.id]}x ${service.name} - ₡${service.price} c/u = ₡${calculateSubtotal(
            service.price,
            service.id
          )}`
      );
      const combosMessage = selectedCombos.map(
        (combo) =>
          `${comboQuantities[combo.id]}x ${combo.name} - ₡${combo.price} c/u = ₡${calculateComboSubtotal(
            combo
          )}`
      );
      const totalPrice = calculateTotal() + calculateTotalCombos();
      const finalMessage = `${message}${servicesMessage.join("\n")}\n${combosMessage.join(
        "\n"
      )}\nTotal: ₡${totalPrice.toLocaleString("es-CR")}`;
      const whatsappLink = `https://api.whatsapp.com/send?phone=506${subproductData.phone_number}&text=${encodeURIComponent(
        finalMessage
      )}`;
      window.open(whatsappLink, "_blank");
      closeWhatsAppModal();
    } else {
      alert("No hay servicios o combos seleccionados para enviar el mensaje.");
    }
  };

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [consulta, setConsulta] = useState("");

  return (
    <>
       <div style={{ textAlign: "center" }}>
        <button
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "3.5em",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={openWhatsAppModal}
        >
          <i
            className="fab fa-whatsapp"
            style={{ marginRight: "5px", lineHeight: "1.5" }}
          ></i>{" "}
          Cotizar por WhatsApp
        </button>
      </div>
      <Modal
        isOpen={showWhatsAppModal}
        onRequestClose={closeWhatsAppModal}
        contentLabel="Enviar mensaje por WhatsApp"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            width: "90%",
            maxWidth: "500px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 10001, // Ensure modal is above button
          },
        }}
      >
        <span
          onClick={closeWhatsAppModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "1.5em",
            color: "#e74c3c",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ×
        </span>
        <h2
          style={{
            fontSize: "1.8em",
            color: "#333",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Cotizar por WhatsApp
        </h2>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", fontSize: "1em", color: "#333", marginBottom: "5px" }}
          >
            Nombre:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1em",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", fontSize: "1em", color: "#333", marginBottom: "5px" }}
          >
            Apellido:
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1em",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", fontSize: "1em", color: "#333", marginBottom: "5px" }}
          >
            Correo:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1em",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", fontSize: "1em", color: "#333", marginBottom: "5px" }}
          >
            Consulta:
          </label>
          <textarea
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1em",
              minHeight: "100px",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4CAF50")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
        <button
          className="button"
          onClick={sendWhatsAppMessage}
        >
          Enviar
        </button>
      </Modal>
    </>
  );
};

export default WhatsAppModal;