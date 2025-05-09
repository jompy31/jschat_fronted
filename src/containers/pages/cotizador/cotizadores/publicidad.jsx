import React, { useState } from 'react';
import Data from '../datos_cotizador/publicidad.json'; // Asegúrate de que la ruta sea correcta
import numeral from 'numeral';
import './Cotizador.css';
import { useMediaQuery } from "react-responsive";

const Publicidad = () => {
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [nombreServicio, setNombreServicio] = useState(''); // Estado para filtrar por nombre
  const [serviciosFiltrados, setServiciosFiltrados] = useState(Data); // Estado para almacenar los servicios filtrados
  const [mostrarModal, setMostrarModal] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  // Función para filtrar los servicios por nombre
  const filtrarServiciosPorNombre = (nombre) => {
    setNombreServicio(nombre);
    const serviciosFiltrados = Data.filter((servicio) =>
      servicio.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    setServiciosFiltrados(serviciosFiltrados);
  };

  const formatNumber = (value) => {
    return numeral(value).format('0,0');
  };

  // Mostrar la tabla en el modal
  const mostrarTablaComoModal = () => {
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  return (
    <div style={{
      textAlign: "center",
      padding: "20px",
      borderRadius: "10px",
      marginTop: "10%",
      border: "2px solid blue",
      boxShadow: "0 0 10px gray",
    }}>
      <h2 style={{
        color: 'blue',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px #000',
      }}>Servicios de Publicidad</h2>

      <div className="cotizador-container">
        <label>
          <strong>Buscar Servicio por Nombre:</strong>
          <input
            type="text"
            value={nombreServicio}
            onChange={(e) => filtrarServiciosPorNombre(e.target.value)}
            style={{
              border: "1px solid gray",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          />
        </label>

        <div className="cotizador-inputs">
          <button onClick={() => setMostrarTabla(!mostrarTabla)} style={{
            backgroundColor: "blue",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #666",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: isMobile ? "0.6rem" : "1.2rem",
          }}>
            {mostrarTabla ? 'Cerrar Tabla' : 'Buscar'}
          </button>
          <button onClick={mostrarTablaComoModal} style={{
            backgroundColor: "green",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #666",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: isMobile ? "0.6rem" : "1.2rem",
          }}>
            Mostrar Lista de Servicios
          </button>
        </div>
      </div>

      {mostrarTabla && (
        <div>
          <h2>Servicios Disponibles</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre del Servicio</th>
                <th>Descripción</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {serviciosFiltrados.map((servicio, index) => (
                <tr key={index}>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.descripcion}</td>
                  <td>₡{formatNumber(servicio.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="modal" onClick={cerrarModal}>
          <div className="modal-content rounded-shadow"
            style={{ maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <span className="close1" onClick={cerrarModal}>&times;</span>
            <h2>Servicios de Publicidad Disponibles</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre del Servicio</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {serviciosFiltrados.map((servicio, index) => (
                  <tr key={index}>
                    <td>{servicio.nombre}</td>
                    <td>{servicio.descripcion}</td>
                    <td>₡{formatNumber(servicio.precio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publicidad;
