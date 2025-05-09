import React, { useState } from 'react';
import Data from '../../datos_cotizador/datos_colegios/Colegio_agronomos.json';
import numeral from 'numeral';
import '../Cotizador.css';
import { useMediaQuery } from "react-responsive";

const ColegioAgronomos = () => {
    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [nombreModalidad, setNombreModalidad] = useState('');
    const [modalidadesFiltradas, setModalidadesFiltradas] = useState(Data.modalidades);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isMini = useMediaQuery({ query: "(max-width: 340px)" });

    // Función para filtrar modalidades por nombre
    const filtrarModalidadesPorNombre = (nombre) => {
        setNombreModalidad(nombre);
        const modalidadesFiltradas = Data.modalidades.filter((modalidad) =>
            modalidad.modalidad.toLowerCase().includes(nombre.toLowerCase())
        );
        setModalidadesFiltradas(modalidadesFiltradas);
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
            }}>{Data.colegio}</h2>
            <a href={Data.pagina_web} target="_blank" rel="noopener noreferrer" style={{ color: 'green', fontWeight: 'bold' }}>
                Sitio Web Oficial {Data.pagina_web}
            </a>
            <div className="cotizador-container">
                <label>
                    <strong>Buscar Modalidad por Nombre:</strong>
                    <input
                        type="text"
                        value={nombreModalidad}
                        onChange={(e) => filtrarModalidadesPorNombre(e.target.value)}
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
                    {mostrarTabla ? 'Cerrar Tabla' : 'Ver Modalidades'}
                </button>
            </div>

            {mostrarTabla && (
                <div>
                    <h2>Modalidades Disponibles</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Modalidad</th>
                                <th>Cantidad</th>
                                <th>Visitas Mínimas</th>
                                <th>Honorarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modalidadesFiltradas.map((modalidad, index) => (
                                modalidad.rangos.map((rango, idx) => (
                                    <tr key={`${index}-${idx}`}>
                                        <td>{modalidad.modalidad}</td>
                                        <td>{rango.cantidad}</td>
                                        <td>{rango.visitas_minimas}</td>
                                        <td>₡{(rango.honorarios)} </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ColegioAgronomos;
