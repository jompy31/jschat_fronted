import React, { useState, useEffect } from 'react';
import Data from '../datos_cotizador/asuntos.json';
import numeral from 'numeral';
import './Cotizador.css';
import { useMediaQuery } from "react-responsive";

const TraspasosBienes = () => {
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [tipoServicio, setTipoServicio] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cotizacionesCercanas, setCotizacionesCercanas] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  const mostrarTablaComoModal = () => {
    setMostrarModal(true);
  };
useEffect(()=>{
    mostrarTablaComoModal()
  },[])
  const cerrarModal = () => {
    setMostrarModal(false);
    setTipoServicio('');
    setCotizacionesCercanas([]);
  };

  const toggleTabla = () => {
    setMostrarTabla(!mostrarTabla);
  };

  const calcularCotizacion = () => {
    // console.log("tipo servicio", tipoServicio);
    if (!tipoServicio) {
      console.error("Error: Tipo de servicio no válido");
      return;
    }

    // Descomponer la cadena para obtener la categoría y el nombre del servicio
    const [categoria, nombreServicio] = tipoServicio.split('-');

    // Ajusta la lógica de cotización según la estructura de asuntos.json
    const cotizacionesOrdenadas = Data[categoria].filter(servicio => servicio.nombre_servicio === nombreServicio).slice(0, 2);

    // console.log("datos", Data);
    setCotizacionesCercanas(cotizacionesOrdenadas);
    toggleTabla();
  };

  const formatNumber = (value) => {
    return numeral(value).format('0,0');  // Utilizar numeral para formatear números
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
      }}>Cotizador de Asuntos Notariales</h2>

      <div className="cotizador-container">
        <label>
          <strong>Tipo de Servicio:</strong>
          <select
            value={tipoServicio}
            onChange={(e) => setTipoServicio(e.target.value)}
            style={{
              width: "60%",
              maxWidth: "400px",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          >
            <option value="">Seleccione un servicio</option>
            {Object.keys(Data).flatMap((categoria) =>
              Data[categoria].map((servicio, index) => (
                <option key={`${categoria}-${index}`} value={`${categoria}-${servicio.nombre_servicio}`}>
                  {servicio.nombre_servicio}
                </option>
              ))
            )}
          </select>
        </label>
        <div className="cotizador-inputs">
          <button onClick={calcularCotizacion} style={{
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #ff4444",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: isMobile ? "0.6rem" : "1.2rem",
          }}>
            {mostrarTabla ? 'Cerrar Tabla' : 'Calcular Cotización'}
          </button>
          <button onClick={mostrarTablaComoModal} style={{
            backgroundColor: "green",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #ff4444",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: isMobile ? "0.6rem" : "1.2rem",
          }}>
            Mostrar Lista de Precios
          </button>
        </div>
      </div>
      {mostrarTabla && (
        <div>
          <h2>Asuntos Notariales </h2>
          <table>
            <thead>
              <tr>
                <th>Nombre del Servicio</th>
                <th>Valor</th>
                <th>Monto de IVA</th>
                <th>Valor del Servicio en Dólares</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionesCercanas.map((servicio, index) => (
                <tr key={index}>
                  <td>{servicio.nombre_servicio}</td>
                  <td>{formatNumber(servicio.valor)}</td>
                  <td>{formatNumber(servicio.monto_iva)}</td>
                  <td>{formatNumber(servicio.valor_del_servicio_dolares)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {mostrarModal && (
        // <div className="modal" onClick={cerrarModal}>
        //   <div className="modal-content rounded-shadow"
        //     style={{ maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div>
            <span className="close1" onClick={cerrarModal}>&times;</span>
            <h2>Servicios Notariales</h2>
            <table>
              <thead>
                <tr>
                  <th>Nombre del Servicio</th>
                  <th>Valor</th>
                  <th>Monto de IVA</th>
                  <th>Valor del Servicio en Dólares</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(Data).flatMap((categoria, index) =>
                  Data[categoria].map((servicio, subIndex) => (
                    <tr key={`${index}-${subIndex}`}>
                      <td>{servicio.nombre_servicio}</td>
                      <td>{servicio.valor}</td>
                      <td>{servicio.monto_iva}</td>
                      <td>{servicio.valor_del_servicio_dolares}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default TraspasosBienes;
