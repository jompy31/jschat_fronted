// ./details/empleos.jsx
import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";

const EmpleosModal = ({ showModal, closeModal, selectedOfertaData, allPuesto, handleAplicar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    experienciaLaboral: "",
    cualidades: "",
    motivoAplicacion: "",
    formacionAcademica: ""
  });

  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviarWhatsApp = () => {
    const mensajeWhatsApp = `
      Nombre: ${formData.nombre}
      Correo: ${formData.correo}
      Teléfono: ${formData.telefono}
      Experiencia Laboral: ${formData.experienciaLaboral}
      Cualidades: ${formData.cualidades}
      Motivo de Aplicación: ${formData.motivoAplicacion}
      Formación Académica: ${formData.formacionAcademica}
    `;
    const numeroWhatsApp = "50687886767"; // Coloca aquí el número de WhatsApp deseado
    // Aquí debes implementar la lógica para enviar el mensaje de WhatsApp
    // console.log(`Enviando a WhatsApp ${numeroWhatsApp}: ${mensajeWhatsApp}`);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(
      mensajeWhatsApp
    )}`;
    window.open(whatsappLink, "_blank");
  };

  const handleShowSecondModal = () => {
    setShowSecondModal(true);
  };

  const handleCloseSecondModal = () => {
    setShowSecondModal(false);
  };

  return (
    <>
    <Modal
      show={showModal}
      onHide={closeModal}
      dialogClassName="modal-scrollable"
      style={{ overflowY: "auto" }}
    >
      <Modal.Title>
        {selectedOfertaData && selectedOfertaData.puesto
          ? Array.isArray(selectedOfertaData.puesto)
            ? selectedOfertaData.puesto
                .map((roleId) => {
                  const role = allPuesto.find((r) => r.id === roleId);
                  return role ? role.nombre : "";
                })
                .join(", ")
            : allPuesto.find((r) => r.id === selectedOfertaData.puesto)?.nombre || ""
          : "N/A"}
      </Modal.Title>
      <Modal.Body style={{ backgroundColor: "white", color: "black" }}>
        <Table bordered hover>
          <h4> Oferta de Trabajo</h4>
          <tbody>
            <tr>
              <td>Puesto</td>
              <td>
                {selectedOfertaData && selectedOfertaData.puesto
                  ? Array.isArray(selectedOfertaData.puesto)
                    ? selectedOfertaData.puesto
                        .map((roleId) => {
                          const role = allPuesto.find((r) => r.id === roleId);
                          return role ? role.nombre : "";
                        })
                        .join(", ")
                    : allPuesto.find((r) => r.id === selectedOfertaData.puesto)?.nombre || ""
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Empresa</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.empresa_nombre : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Beneficios Adicionales</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.beneficios_adicionales : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Requisitos</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.requisitos : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Fecha Límite de Aplicación</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.fecha_limite_aplicacion : "N/A"}
              </td>
            </tr>
            {/* Agrega más campos según sea necesario */}
          </tbody>
        </Table>
        {/* Nueva sección para la tabla de datos del puesto */}
        <h4>Datos del Puesto</h4>
        <Table bordered hover>
          <tbody>
            <tr>
              <td>Nombre</td>
              <td>
                {selectedOfertaData && selectedOfertaData.puesto
                  ? Array.isArray(selectedOfertaData.puesto)
                    ? selectedOfertaData.puesto
                        .map((roleId) => {
                          const role = allPuesto.find((r) => r.id === roleId);
                          return role ? role.nombre : "";
                        })
                        .join(", ")
                    : allPuesto.find((r) => r.id === selectedOfertaData.puesto)?.nombre || ""
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Descripción</td>
              <td>
                {selectedOfertaData && selectedOfertaData.puesto
                  ? Array.isArray(selectedOfertaData.puesto)
                    ? selectedOfertaData.puesto
                        .map((roleId) => {
                          const role = allPuesto.find((r) => r.id === roleId);
                          return role ? role.descripcion : "";
                        })
                        .join(", ")
                    : allPuesto.find((r) => r.id === selectedOfertaData.puesto)?.descripcion || ""
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Beneficios Adicionales</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.beneficios_adicionales : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Responsabilidades</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.responsabilidades_clave : "N/A"}
              </td>
            </tr>
            <tr>
              <td>Requisitos</td>
              <td>
                {selectedOfertaData ? selectedOfertaData.requisitos : "N/A"}
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "white", color: "black" }}>
        <Button variant="danger" onClick={closeModal}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleShowSecondModal}>
            Aplicar
          </Button>
      </Modal.Footer>
    </Modal>
     {/* Segundo Modal */}
     <Modal show={showSecondModal} onHide={handleCloseSecondModal} dialogClassName="modal-scrollable"
      style={{ overflowY: "auto" }}>
  <Modal.Header closeButton>
    <Modal.Title>Datos Adicionales</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form>
      <div>
        {/* Fila 1 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Nombre Completo</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Fila 2 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Correo</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Fila 3 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Número de Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Fila 4 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Experiencia Laboral</label>
          <textarea
            name="experienciaLaboral"
            value={formData.experienciaLaboral}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>

        {/* Fila 5 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Cualidades</label>
          <input
            type="text"
            name="cualidades"
            value={formData.cualidades}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Fila 6 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Motivo de Aplicación</label>
          <input
            type="text"
            name="motivoAplicacion"
            value={formData.motivoAplicacion}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Fila 7 */}
        <div style={{ marginBottom: "15px" }}>
          <label>Formación Académica</label>
          <input
            type="text"
            name="formacionAcademica"
            value={formData.formacionAcademica}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>

      {/* Agrega más campos según sea necesario */}

      <Button variant="primary" onClick={enviarWhatsApp}>
        Enviar por WhatsApp
      </Button>
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseSecondModal}>
      Cerrar
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default EmpleosModal;