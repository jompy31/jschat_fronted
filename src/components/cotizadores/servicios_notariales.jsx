import React, { useState, useEffect} from 'react';
import Data from '../datos_cotizador/servicios_notariales.json';
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
    setTipoServicio(''); // Reiniciar el tipo de servicio
    setCotizacionesCercanas([]); // Reiniciar las cotizaciones cercanas
  };

  const toggleTabla = () => {
    setMostrarTabla(!mostrarTabla);
  };

  const calcularCotizacion = () => {
    const cotizacionesOrdenadas = Data.servicios
      .map(servicio => ({
        ...servicio,
        // Puedes cambiar esta lógica según tus necesidades específicas
        diferencia: servicio.tipo_servicio === tipoServicio ? 0 : 1,
      }))
      .sort((a, b) => a.diferencia - b.diferencia)
      .slice(0, 2);

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
        textShadow: '2px 2px 4px #000', // Sombra roja
      }}>Cotizador de Servicios Notariales</h2>

      <div className="cotizador-container">
        <label>
          <strong>Tipo de Servicio:</strong>
          <select
            value={tipoServicio}
            onChange={(e) => setTipoServicio(e.target.value)}
            style={{
              width: "60%", // Hacemos que el input ocupe el 60% de la pantalla
              maxWidth: "400px", // Establecemos un ancho máximo para evitar que sea demasiado ancho en pantallas grandes
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          >
            <option value="">Seleccione un servicio</option>
            {Data.servicios.map((servicio, index) => (
              <option key={index} value={servicio.tipo_servicio}>
                {servicio.tipo_servicio}
              </option>
            ))}
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
          <h2>Servicios Notariales (Tabla)</h2>
          <table>
            <thead>
              <tr>
                <th>Tipo de Servicio</th>
                <th>Timbres de Registro</th>
                <th>Honorarios de Escritura</th>
                <th>Monto de IVA</th>
                <th>Valor del Servicio en Colones</th>
                <th>Valor del Servicio en Dólares</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionesCercanas.map((servicio, index) => (
                <tr key={index}>
                  <td>{servicio.tipo_servicio}</td>
                  <td>{formatNumber(servicio.timbres_registro)}</td>
                  <td>{formatNumber(servicio.honorarios_escritura)}</td>
                  <td>{formatNumber(servicio.monto_iva)}</td>
                  <td>{formatNumber(servicio.valor_del_servicio)}</td>
                  <td>{formatNumber(servicio.valor_del_servicio_dolares)}</td>
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
            <h2>Servicios Notariales</h2>
            <table>
              <thead>
                <tr>
                  <th>Tipo de Servicio</th>
                  <th>Timbres de Registro</th>
                  <th>Honorarios de Escritura</th>
                  <th>Monto de IVA</th>
                  <th>Valor del Servicio en Colones</th>
                  <th>Valor del Servicio en Dólares</th>
                </tr>
              </thead>
              <tbody>
                {Data.servicios.map((servicio, index) => (
                  <tr key={index}>
                    <td>{servicio.tipo_servicio}</td>
                    <td>{servicio.timbres_registro}</td>
                    <td>{servicio.honorarios_escritura}</td>
                    <td>{servicio.monto_iva}</td>
                    <td>{servicio.valor_del_servicio}</td>
                    <td>{servicio.valor_del_servicio_dolares}</td>
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
