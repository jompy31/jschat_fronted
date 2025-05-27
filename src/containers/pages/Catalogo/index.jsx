import React, { useRef, useState } from 'react';
import Contraportada from '../../../assets/catalogo/requisitos_propiedades.pdf';
import Valeautos from '../../../assets/catalogo/requisitos_valeautos.pdf';
import Sucesorios from '../../../assets/catalogo/requisitos_sucesorios.pdf';
import Contraportadaimg from '../../../assets/catalogo/requisitos_propiedades.jpg';
import Valeautosimg from '../../../assets/catalogo/requisitos_valeautos.jpg';
import Sucesoriosimg from '../../../assets/catalogo/requisitos_sucesorios.jpg';
import { useMediaQuery } from 'react-responsive';

const Catalogo = () => {
  const catalogoRef = useRef(null);
  const [fullScreen, setFullScreen] = useState(null);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMini = useMediaQuery({ query: '(max-width: 340px)' });

  const pdfs = [
    { src: Contraportada, img: Contraportadaimg, alt: 'Contraportada' },
    { src: Valeautos, img: Valeautosimg, alt: 'Valeautos' },
    { src: Sucesorios, img: Sucesoriosimg, alt: 'Sucesorios' },
  ];

  const scrollToCatalogo = () => {
    if (catalogoRef.current) {
      catalogoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageClick = (index) => {
    console.log('Índice seleccionado:', index, 'Imagen:', pdfs[index].img);
    if (isMobile) {
      // On mobile, show the image in fullscreen
      setFullScreen(pdfs[index].img);
    } else {
      // On non-mobile, show the PDF
      setFullScreen(pdfs[index].src);
    }
    setCurrentPdfIndex(index);
    setZoomLevel(1);
  };

  const handleCloseFullScreen = () => {
    setFullScreen(null);
    setZoomLevel(1);
  };

  const handleNextPdf = () => {
    const nextIndex = (currentPdfIndex + 1) % pdfs.length;
    console.log('Siguiente elemento, índice:', nextIndex);
    setCurrentPdfIndex(nextIndex);
    setFullScreen(isMobile ? pdfs[nextIndex].img : pdfs[nextIndex].src);
    setZoomLevel(1);
  };

  const handlePrevPdf = () => {
    const prevIndex = (currentPdfIndex - 1 + pdfs.length) % pdfs.length;
    console.log('Elemento anterior, índice:', prevIndex);
    setCurrentPdfIndex(prevIndex);
    setFullScreen(isMobile ? pdfs[prevIndex].img : pdfs[prevIndex].src);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div>
      {/* Sección de Imágenes */}
      <div
        style={{
          width: '100vw',
          height: isMini ? '50vh' : isMobile ? '30vh' : '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: isMobile ? '20%' : '6%',
          gap: '20px',
        }}
      >
        {pdfs.map((pdf, index) => (
          <div
            key={index}
            style={{
              width: '30%',
              height: '100%',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid lightgray',
              aspectRatio: '8.5 / 11',
            }}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={pdf.img}
              alt={pdf.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
              }}
              onMouseOver={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                if (!isMobile) {
                  e.target.style.transform = 'scale(1)';
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Botón "Ver más productos" */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <button
          onClick={scrollToCatalogo}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#008000',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: '0.3s ease',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#000000';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#008000';
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

      {/* Modal de pantalla completa */}
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
          <div
            style={{
              position: 'relative',
              width: '90vw',
              height: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {isMobile ? (
              <img
                src={fullScreen}
                alt={pdfs[currentPdfIndex].alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.3s ease',
                }}
              />
            ) : (
              <iframe
                src={fullScreen}
                title={pdfs[currentPdfIndex].alt}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.3s ease',
                }}
              />
            )}
            <button
              onClick={handlePrevPdf}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '10px',
                fontSize: '24px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              &lt;
            </button>
            <button
              onClick={handleNextPdf}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '10px',
                fontSize: '24px',
                backgroundColor: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              &gt;
            </button>
            <button
              onClick={handleZoomIn}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-60px)',
                padding: '10px',
                fontSize: '18px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(10px)',
                padding: '10px',
                fontSize: '18px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              -
            </button>
            <button
              onClick={handleCloseFullScreen}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '10px',
                fontSize: '18px',
                backgroundColor: '#ff0000',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;