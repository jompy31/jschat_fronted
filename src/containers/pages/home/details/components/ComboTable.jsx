import React from "react";

const ComboTable = ({
  subCombos,
  comboQuantities,
  setComboQuantities,
  calculateComboSubtotal,
  calculateTotalCombos,
  isMini,
}) => {
  if (!subCombos.length) return null;

  return (
    <div className="card">
      <h2 className="section-header">Combos Disponibles</h2>
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
              <th>Servicios</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {subCombos.map((combo) => (
              <tr key={combo.id}>
                <td>
                  <input
                    type="number"
                    value={comboQuantities[combo.id] || 0}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                        setComboQuantities({
                          ...comboQuantities,
                          [combo.id]: newQuantity,
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
                <td style={{ fontWeight: 600 }}>{combo.name}</td>
                <td>{combo.description}</td>
                <td>
                  <ul style={{ paddingLeft: "20px", margin: "0", listStyleType: "disc" }}>
                    {combo.services ? (
                      combo.services.map((service, serviceIndex) => (
                        <li
                          key={serviceIndex}
                          style={{ marginBottom: "5px", color: "#333" }}
                        >
                          {service.name} - ₡{service.price}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: "#666" }}>No hay servicios disponibles</li>
                    )}
                  </ul>
                  {combo.services && (
                    <p
                      style={{
                        marginTop: "10px",
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      Total Servicios: ₡
                      {combo.services
                        .reduce(
                          (total, service) => total + parseFloat(service.price),
                          0
                        )
                        .toLocaleString("es-CR")}
                    </p>
                  )}
                </td>
                <td>₡{combo.price}</td>
                <td>₡{calculateComboSubtotal(combo)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" style={{ textAlign: "right", fontWeight: 600 }}>
                Total
              </td>
              <td>₡{calculateTotalCombos()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ComboTable;