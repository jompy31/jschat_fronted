import React, { useState, useEffect } from 'react';
import Data from '../datos_cotizador/levantamiento_prendas.json';
import numeral from 'numeral';
import './Cotizador.css';
import { useMediaQuery } from "react-responsive";

const TraspasosBienes = () => {
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
  
  useEffect(() => {
    mostrarTablaComoModal();
  }, []); 
  const cerrarModal = () => {
    setMostrarModal(false);
    setValorFiscal('');
    setCotizacionesCercanas([]);
  };

  const toggleTabla = () => {
    setMostrarTabla(!mostrarTabla);
  };
  const convertirAValorNumerico = (valor) => {
    // Eliminar el símbolo "₡", los espacios y las comas, luego convertir a número
    return parseFloat(valor.replace(/[₡, ]/g, ''));
  };
  const calcularCotizacion = () => {
    const valorFiscalNumerico = convertirAValorNumerico(valorFiscal);
    // console.log("valorFiscar", valorFiscalNumerico)
    if (isNaN(valorFiscalNumerico)) {
      alert('Ingresa un valor fiscal válido');
      return;
    }

    const cotizacionesOrdenadas = Data.levantamiento_prendas
      .map(traspaso => ({
        ...traspaso,
        diferencia: Math.abs(valorFiscalNumerico - convertirAValorNumerico(traspaso.valor_del_bien)),
      }))
      .sort((a, b) => a.diferencia - b.diferencia)
      .slice(0, 2);

    // Usar una tolerancia para la comparación
    const tolerancia = 0.01; // Puedes ajustar esto según tus necesidades
    const cotizacionExacta = cotizacionesOrdenadas.find(cotizacion => cotizacion.diferencia < tolerancia);

    // console.log("cotizacionesOrdenadas", cotizacionesOrdenadas);
    // console.log("cotizacionExacta", cotizacionExacta);

    setCotizacionesCercanas(cotizacionesOrdenadas);

    // Establecer la cotización más aproximada
    setCotizacionAproximada(cotizacionesOrdenadas[0]);
    // console.log(`Cotización Aproximada: ${cotizacionesOrdenadas[0].valor_del_bien}`);
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
      }}>Levantamiento de Prendas</h2>
      <ul>
        <li>* Todo monto mayor a $10,000 al tipo de cambio actual paga declaración jurada.</li>
        <li>* En caso de ser donación no aplica la declaración jurada.</li>
      </ul>
      <div className="cotizador-container">
        <label>
          <strong>Valor Fiscal Automotor:</strong>
          ₡<input
            type="text"
            value={formatNumber(valorFiscal)}
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
                    <th>Valor Fiscal del Inmueble</th>
                    <th>Timbres de Registro</th>
                    <th>Honorarios Base</th>
                    <th>Declaración Jurada</th>
                    <th>Subtotal Honorarios</th>
                    <th>IVA</th>
                    <th>Valor Traspaso en Colones</th>
                    <th>Valor Traspaso en Dólares</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacionesCercanas.map((cotizacion, index) => (
                    <tr key={index}>
                      <td>{formatNumber(cotizacion.valor_del_bien)}</td>
                      <td>{formatNumber(cotizacion.timbres_registro)}</td>
                      <td>{formatNumber(cotizacion.honorarios_base)}</td>
                      <td>{cotizacion.declaracion_jurada}</td>
                      <td>{formatNumber(cotizacion.sub_total_honorarios)}</td>
                      <td>{formatNumber(cotizacion.monto_iva)}</td>
                      <td>{formatNumber(cotizacion.valor_del_traspaso)}</td>
                      <td>{formatNumber(cotizacion.valor_trasp_prop_dolares)}</td>
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
            <h2>Levantamiento de Prendas</h2>
            <table>
              <thead>
                <tr>
                  <th>Valor del bien</th>
                  <th>Timbres de Registro</th>
                  <th>Honorarios Base</th>
                  <th>Declaración Jurada</th>
                  <th>Subtotal Honorarios</th>
                  <th>IVA</th>
                  <th>Valor Traspaso en Colones</th>
                  <th>Valor Traspaso en Dólares</th>
                </tr>
              </thead>
              <tbody>
                {Data.levantamiento_prendas.map((traspaso, index) => (
                  <tr key={index}>
                    <td>{traspaso.valor_del_bien}</td>
                    <td>{traspaso.timbres_registro}</td>
                    <td>{traspaso.honorarios_base}</td>
                    <td>{traspaso.declaracion_jurada}</td>
                    <td>{traspaso.sub_total_honorarios}</td>
                    <td>{traspaso.monto_iva}</td>
                    <td>{traspaso.valor_del_traspaso}</td>
                    <td>{traspaso.valor_trasp_prop_dolares}</td>
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




export default TraspasosBienes;
