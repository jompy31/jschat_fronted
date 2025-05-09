import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Error404.css'; // Importamos el archivo CSS para las animaciones

function Error404() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir automáticamente después de 5 segundos
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000);

        // Limpiar el temporizador al desmontar el componente
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="error-container">
            <div className="error-message">
                <h1 className="error-code">404</h1>
                <p className="error-description">Oops! La página de ABCupon que buscas no se encuentra disponible.</p>
                <p className="redirect-message">Serás redirigido en 5 segundos...</p>
            </div>
        </div>
    );
}

export default Error404;
