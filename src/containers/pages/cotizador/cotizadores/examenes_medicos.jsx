import React, { useState } from 'react';
import Data from '../datos_cotizador/examenes_salud.json'; // Cambia la ruta si es necesario
import numeral from 'numeral';
import './Cotizador.css';
import { useMediaQuery } from "react-responsive";

const ExamenesSalud = () => {
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [nombreExamen, setNombreExamen] = useState(''); // Estado para filtrar por nombre
  const [examenesFiltrados, setExamenesFiltrados] = useState(Data); // Estado para almacenar los exámenes filtrados
  const [mostrarModal, setMostrarModal] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  // Función para filtrar los exámenes por nombre
  const filtrarExamenesPorNombre = (nombre) => {
    setNombreExamen(nombre);
    const examenesFiltrados = Data.filter((examen) =>
      examen.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    setExamenesFiltrados(examenesFiltrados);
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
      border: "2px solid red",
      boxShadow: "0 0 10px black",
    }}>
      <h2 style={{
        color: 'red',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px #000',
      }}>Exámenes de Salud</h2>

      <div className="cotizador-container">
        <label>
          <strong>Buscar Examen por Nombre:</strong>
          <input
            type="text"
            value={nombreExamen}
            onChange={(e) => filtrarExamenesPorNombre(e.target.value)}
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          />
        </label>

        <div className="cotizador-inputs">
          <button onClick={() => setMostrarTabla(!mostrarTabla)} style={{
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #ff4444",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: "18px",
          }}>
            {mostrarTabla ? 'Cerrar Tabla' : 'Buscar'}
          </button>
          <button onClick={mostrarTablaComoModal} style={{
            backgroundColor: "green",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #ff4444",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: "18px",
          }}>
            Mostrar Lista de Exámenes
          </button>
        </div>
      </div>

      {mostrarTabla && (
        <div>
          <h2>Exámenes Disponibles</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre del Examen</th>
                <th>Descripción</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {examenesFiltrados.map((examen, index) => (
                <tr key={index}>
                  <td>{examen.nombre}</td>
                  <td>{examen.descripcion}</td>
                  <td>₡{formatNumber(examen.precio)}</td>
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
            <h2>Exámenes Disponibles</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre del Examen</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {examenesFiltrados.map((examen, index) => (
                  <tr key={index}>
                    <td>{examen.nombre}</td>
                    <td>{examen.descripcion}</td>
                    <td>₡{formatNumber(examen.precio)}</td>
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

export default ExamenesSalud;
