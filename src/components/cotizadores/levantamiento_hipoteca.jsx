import React, { useState, useEffect } from 'react';
import Data from '../datos_cotizador/levantamiento_hipoteca.json';
import numeral from 'numeral';
import './Cotizador.css';
import { useMediaQuery } from "react-responsive";

const LevantamientoHipoteca = () => {
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [valorFiscal, setValorFiscal] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cotizacionesCercanas, setCotizacionesCercanas] = useState([]);
  const [cotizacionAproximada, setCotizacionAproximada] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  const mostrarTablaComoModal = () => {
    setMostrarModal(true);
  };
  useEffect(()=> {
        mostrarTablaComoModal ()
      },[])

  const cerrarModal = () => {
    setMostrarModal(false);
    setValorFiscal('');
    setCotizacionesCercanas([]);
  };

  const toggleTabla = () => {
    setMostrarTabla(!mostrarTabla);
  };

  const convertirAValorNumerico = (valor) => {
    return parseFloat(valor.replace(/[₡, ]/g, ''));
  };

  const calcularCotizacion = () => {
    const valorFiscalNumerico = convertirAValorNumerico(valorFiscal);
    if (isNaN(valorFiscalNumerico)) {
      alert('Ingresa un valor fiscal válido');
      return;
    }

    const cotizacionesOrdenadas = Data.levantamiento_hipoteca
      .map(traspaso => ({
        ...traspaso,
        diferencia: Math.abs(valorFiscalNumerico - convertirAValorNumerico(traspaso.monto_hipoteca)),
      }))
      .sort((a, b) => a.diferencia - b.diferencia)
      .slice(0, 2);

    setCotizacionesCercanas(cotizacionesOrdenadas);
    setCotizacionAproximada(cotizacionesOrdenadas[0]);
    toggleTabla();
  };

  const formatNumber = (value) => {
    return numeral(value).format('0,0');
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
      }}>Levantamiento de Hipoteca</h2>

      <div className="cotizador-container">
        <label>
          <strong>Valor de Hipoteca:</strong>
          ₡<input
            type="text"
            value={valorFiscal}
            onChange={(e) => setValorFiscal(e.target.value)}
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          />
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
          {cotizacionesCercanas.length > 0 && (
            <div>
              <h2>Cotizaciones Más Aproximadas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Monto de Hipoteca</th>
                    <th>Timbres de Registro</th>
                    <th>Honorarios Base</th>
                    <th>Valor Traspaso en Colones</th>
                    <th>Valor Traspaso en Dólares</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacionesCercanas.map((cotizacion, index) => (
                    <tr key={index}>
                      <td>{formatNumber(cotizacion.monto_hipoteca)}</td>
                      <td>{formatNumber(cotizacion.timbres_registro)}</td>
                      <td>{formatNumber(cotizacion.honorarios_base)}</td>
                      <td>{formatNumber(cotizacion.valor_levantamiento)}</td>
                      <td>{formatNumber(cotizacion.valor_levantamiento_dolares)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {mostrarModal && (
        <div className="modal" onClick={cerrarModal}>
          <div className="modal-content rounded-shadow"
            style={{ maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <span className="close1" onClick={cerrarModal}>&times;</span>
            <h2>Levantamiento de Hipoteca</h2>
            <table>
              <thead>
                <tr>
                  <th>Monto de Hipoteca</th>
                  <th>Timbres de Registro</th>
                  <th>Honorarios Base</th>
                  <th>Valor Traspaso en Colones</th>
                  <th>Valor Traspaso en Dólares</th>
                </tr>
              </thead>
              <tbody>
                {Data.levantamiento_hipoteca.map((traspaso, index) => (
                  <tr key={index}>
                    <td>{traspaso.monto_hipoteca}</td>
                    <td>{traspaso.timbres_registro}</td>
                    <td>{traspaso.honorarios_base}</td>
                    <td>{traspaso.valor_levantamiento}</td>
                    <td>{traspaso.valor_levantamiento_dolares}</td>
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

export default LevantamientoHipoteca;
