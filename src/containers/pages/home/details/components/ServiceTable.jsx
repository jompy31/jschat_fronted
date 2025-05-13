import React from "react";

const ServiceTable = ({
  services,
  quantities,
  setQuantities,
  calculateSubtotal,
  calculateTotal,
  isMini,
  onGeneratePDF,
}) => {
  return (
    <div className="card">
      <h2 className="section-header">Servicios Ofrecidos</h2>
      {!isMini && (
        <button
          className="button"
          onClick={onGeneratePDF}
          style={{ marginBottom: "20px" }}
        >
          Descargar Cotización en PDF
        </button>
      )}
      <div
        style={{
          width: "100%",
          maxHeight: "75vh",
          overflowY: "auto",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table className="custom-table">
          <thead>
            <tr>
              <th>Cantidad</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <input
                      type="number"
                      value={quantities[service.id] || 0}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value, 10);
                        if (newQuantity >= 0) {
                          setQuantities({
                            ...quantities,
                            [service.id]: newQuantity,
                          });
                        }
                      }}
                      style={{
                        width: "60px",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        fontSize: "1em",
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{service.name}</td>
                  <td>{service.description}</td>
                  <td>₡{service.price}</td>
                  <td>₡{calculateSubtotal(service.price, service.id)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  <h3>No hay servicios disponibles.</h3>
                  <p>Mostrando datos predeterminados.</p>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: "right", fontWeight: 600 }}>
                Total
              </td>
              <td>₡{calculateTotal()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ServiceTable;