import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMediaQuery } from 'react-responsive';

const Catalogo = () => {
  const catalogoRef = useRef(null);
  const [fullScreen, setFullScreen] = useState(null);
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Detectar dispositivos
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMini = useMediaQuery({ query: '(max-width: 340px)' });

  const scrollToCatalogo = () => {
    if (catalogoRef.current) {
      catalogoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Meta tags */}
      <Helmet>
        <title>Catálogo de Servicios de JSport</title>
        <meta
          name="description"
          content="Explora el catálogo de servicios de JSport, diseñado para ofrecerte soluciones integrales."
        />
        <meta name="keywords" content="JSport, catálogo de servicios, propiedades, valeautos, sucesorios" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* === SECCIÓN CATÁLOGO - RESPONSIVO === */}
      <section
        ref={catalogoRef}
        className={`
          ${isMobile ? 'pt-13 sm:pt-32' : 'pt-8 md:pt-12'} 
          px-3 xs:px-4 sm:px-6 md:px-8 
          max-w-7xl mx-auto
        `}
        style={{
          marginTop: isMobile ? '120px' : '0',
          transition: 'margin-top 0.3s ease'
        }}
      >
        {/* TÍTULO RESPONSIVO */}
        <h1
          className={`
            text-3xl xs:text-4xl sm:text-5xl md:text-6xl 
            font-bold text-center mb-6 sm:mb-8 
            text-gray-900 dark:text-white 
            leading-tight tracking-tight
            ${isMini ? 'text-2xl' : ''}
          `}
          style={{
            fontSize: 'clamp(1.8rem, 6vw, 4rem)',
            lineHeight: '1.2'
          }}
        >
          Catálogo JSport
        </h1>

        {/* IFRAME RESPONSIVO */}
        <div className="relative w-full overflow-hidden rounded-xl shadow-2xl bg-white dark:bg-gray-800">
          <iframe
            allowFullScreen
            scrolling="no"
            className="fp-iframe w-full"
            src="https://heyzine.com/flip-book/819865ba38.html"
            title="Catálogo JSport"
            style={{
              border: '1px solid #e5e7eb',
              height: isMobile 
                ? (isMini ? '60vh' : '70vh') 
                : '80vh',
              minHeight: '500px',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            loading="lazy"
          ></iframe>

          {/* Overlay de carga (opcional) */}
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center opacity-0 pointer-events-none">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
          </div>
        </div>
      </section>

      {/* === CSS INLINED (para evitar import extra) === */}
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            margin-top: 120px !important;
          }
        }

        @media (min-width: 769px) {
          section {
            margin-top: 0 !important;
          }
        }

        .fp-iframe {
          transition: all 0.3s ease;
        }

        /* Evitar scroll horizontal */
        body, html {
          overflow-x: hidden;
        }

        /* Mejorar renderizado en móviles */
        @media (max-width: 480px) {
          .fp-iframe {
            height: 65vh !important;
          }
        }

        @media (max-width: 340px) {
          .fp-iframe {
            height: 58vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Catalogo;