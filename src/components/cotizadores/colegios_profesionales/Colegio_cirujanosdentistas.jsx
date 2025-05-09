import React, { useState } from 'react';
import Data from '../../datos_cotizador/datos_colegios/Colegio_cirujanosdentistas.json';
import numeral from 'numeral';
import '../Cotizador.css';
import { useMediaQuery } from "react-responsive";

const Colegio_cirujanosdentistas = () => {
    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [categoriaServicio, setCategoriaServicio] = useState('');
    const [serviciosFiltrados, setServiciosFiltrados] = useState(Data.servicios);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const isMini = useMediaQuery({ query: "(max-width: 340px)" });
    // Función para filtrar servicios por categoría
    const filtrarServiciosPorCategoria = (categoria) => {
        setCategoriaServicio(categoria);
        const serviciosFiltrados = Data.servicios.filter((servicio) =>
            servicio.categoria.toLowerCase().includes(categoria.toLowerCase())
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
            }}>{Data.colegio}</h2>
            <a href={Data.pagina_web} target="_blank" rel="noopener noreferrer" style={{ color: 'green', fontWeight: 'bold' }}>
                Sitio Web Oficial {Data.pagina_web}
            </a>
            <div className="cotizador-container">
                <label>
                    <strong>Buscar Servicio por Categoría:</strong>
                    <input
                        type="text"
                        value={categoriaServicio}
                        onChange={(e) => filtrarServiciosPorCategoria(e.target.value)}
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
                                <th>Categoria</th>
                                <th>Servicio</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviciosFiltrados.map((servicio, index) => (
                                <tr key={index}>
                                    <td>{servicio.categoria}</td>
                                    <td>{servicio.servicio}</td>
                                    <td>{servicio.descripcion}</td>
                                    <td>{(servicio.precio.trim())} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Colegio_cirujanosdentistas;
