import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.css';
import Logo from '../../assets/LOGO_rectangular.png'; // Ajusta la ruta según tu proyecto

function Error404() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="error-container">
            <div className="error-message">
                <img src={Logo} alt="Jsport Logo" className="brand-logo" />
                <h1 className="error-code">404</h1>
                <p className="error-description">
                    ¡Ups! La página que buscas en <strong>Jsport</strong> no está disponible.
                </p>
                <p className="redirect-message">Serás redirigido al inicio en 5 segundos...</p>
                <a href="/" className="go-home-button">Ir al Inicio</a>
            </div>
        </div>
    );
}

export default Error404;
