import React, { useState } from 'react';
import Data from '../../datos_cotizador/datos_colegios/Colegio_abogados.json';
import numeral from 'numeral';
import '../Cotizador.css';
import { useMediaQuery } from "react-responsive";

const Colegio_abogados = () => {
    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [nombreServicio, setNombreServicio] = useState('');
    const [serviciosFiltrados, setServiciosFiltrados] = useState(Data.tarifas.servicios);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isMini = useMediaQuery({ query: "(max-width: 340px)" });
    // Función para filtrar los servicios por nombre
    const filtrarServiciosPorNombre = (nombre) => {
        setNombreServicio(nombre);
        const serviciosFiltrados = Data.tarifas.servicios.filter((servicio) =>
            servicio.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
        setServiciosFiltrados(serviciosFiltrados);
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
            border: "2px solid blue",
            boxShadow: "0 0 10px gray",
        }}>
            <h2 style={{
                color: 'blue',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px #000',
            }}>{Data.institucion}</h2>
            <a href={Data.sitio_web} target="_blank" rel="noopener noreferrer" style={{ color: 'green', fontWeight: 'bold' }}>
                Sitio Web Oficial {Data.sitio_web}
            </a>
            <p><strong>Teléfono:</strong> {Data.tarifas.telefono}</p>
            <p><strong>Arancel de Honorarios:</strong> {Data.tarifas.arancel_honorarios}</p>

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
                <button onClick={() => setMostrarTabla(!mostrarTabla)} style={{
                    backgroundColor: "blue",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "5px",
                    padding: "10px",
                    margin: "10px",
                    fontSize: isMobile ? "0.6rem" : "1.2rem",
                }}>
                    {mostrarTabla ? 'Cerrar Tabla' : 'Ver Servicios'}
                </button>
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
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Colegio_abogados;
