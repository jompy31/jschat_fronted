import React, { useRef, useState } from 'react';
import Contraportada from '../../../assets/catalogo/contraportada2.jpg';

const Catalogo = () => {
  const catalogoRef = useRef(null);
  const [fullScreen, setFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const scrollToCatalogo = () => {
    if (catalogoRef.current) {
      catalogoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageClick = () => {
    setFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setFullScreen(false);
    setZoom(1);
  };

  const handleZoom = (event) => {
    event.preventDefault();
    const zoomAmount = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prevZoom) => Math.max(1, Math.min(prevZoom * zoomAmount, 3)));
  };

  const handleClickZoom = (event) => {
    event.stopPropagation(); // Evita que se cierre la imagen
    setZoom((prevZoom) => (prevZoom === 1 ? 2 : 1)); // Alterna entre zoom 1x y 2x
  };

  return (
    <div>
      {/* Sección de la contraportada */}
      <div 
        style={{ 
          width: '100vw', 
          height: '80vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginTop: "6%"
        }}
      >
        <img 
          src={Contraportada} 
          alt="Contraportada" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '100%', 
            objectFit: 'contain', 
            cursor: 'pointer' 
          }} 
          onClick={handleImageClick}
        />
      </div>

      {/* Botón "Ver más productos" */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
  <button 
    onClick={scrollToCatalogo} 
    style={{ 
      padding: '15px 30px', 
      fontSize: '18px', 
      backgroundColor: '#008000', // Verde
      color: 'white', 
      border: 'none', 
      borderRadius: '5px', 
      cursor: 'pointer', 
      transition: '0.3s ease' 
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = '#000000'; // Negro
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = '#008000'; // Verde
    }}
  >
    Ver Catálogo
  </button>
</div>


      {/* Sección del catálogo */}
      <div ref={catalogoRef} style={{ marginTop: '6%' }}>
        <h1>Catálogo ABCupon</h1>
        <iframe
          allowFullScreen
          scrolling="no"
          className="fp-iframe"
          src="https://heyzine.com/flip-book/0214ae368e.html"
          style={{ border: '1px solid lightgray', width: '100%', height: '90vh' }}
          title="Catálogo"
        ></iframe>
      </div>

      {/* Modal de imagen en pantalla completa */}
      {fullScreen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseFullScreen}
        >
          <img 
            src={Contraportada} 
            alt="Contraportada" 
            style={{ 
              transform: `scale(${zoom})`,
              maxWidth: '90vw', 
              maxHeight: '90vh', 
              cursor: 'zoom-in',
              transition: 'transform 0.2s ease-in-out'
            }} 
            onWheel={handleZoom}
            onClick={handleClickZoom}
          />
        </div>
      )}
    </div>
  );
};

export default Catalogo;
