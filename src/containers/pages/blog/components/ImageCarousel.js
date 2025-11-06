import React, { useEffect, useState, useRef } from "react";
import { Image, Spinner, Alert } from "react-bootstrap";
import CuponesData from "../../../../services/products";

const ImageCarousel = ({ className }) => {
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(0); // Controla la posición de scroll

  // === OBTENER CUPONES Y MEZCLAR ALEATORIAMENTE ===
  const fetchCupones = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await CuponesData.getAllCupones();
      const cuponesData = response.data || [];

      // Filtrar y mezclar
      let validCupones = cuponesData
        .filter(coupon => coupon.image && coupon.image.trim() !== "")
        .slice(0, 10);

      // Mezclar aleatoriamente
      validCupones = validCupones
        .map(c => ({ ...c, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...c }) => c);

      // DUPLICAR para efecto infinito (mínimo 2 copias)
      setCupones([...validCupones, ...validCupones, ...validCupones]);
    } catch (err) {
      console.error("Error al cargar cupones:", err);
      setError("No se pudieron cargar las promociones.");
      setCupones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCupones();
  }, []);

  // === SCROLL INFINITO CON REQUESTANIMATIONFRAME ===
  useEffect(() => {
    if (loading || error || cupones.length === 0) return;

    let animationId;
    const speed = 0.5; // píxeles por frame (ajusta para más rápido/lento)
    const itemHeight = 224; // 200px imagen + 24px margen (ajusta si cambias CSS)

    const animate = () => {
      scrollRef.current += speed;
      const totalHeight = itemHeight * (cupones.length / 3); // altura de 1 copia

      if (scrollRef.current >= totalHeight) {
        scrollRef.current = 0; // reinicia
      }

      const container = document.querySelector('.infinite-carousel');
      if (container) {
        container.style.transform = `translateY(-${scrollRef.current}px)`;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [loading, error, cupones]);

  return (
    <div className={` ${className}`}>
      <style>
        {`
          .infinite-carousel-wrapper {
            height: 500vh; /* altura de 1 imagen + margen */
            overflow: hidden;
            position: relative;
          }
          .infinite-carousel {
            display: flex;
            flex-direction: column;
            will-change: transform;
          }
          .carousel-image {
            width: 100%;
            height: 500px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-color);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            flex-shrink: 0;
            margin-bottom: 24px;
          }
          .carousel-image:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(255, 215, 0, 0.5);
          }
          .carousel-image:active {
            transform: scale(1.2);
          }
          @media (max-width: 768px) {
            .infinite-carousel-wrapper { height: 174px; }
            .carousel-image { height: 150px; margin-bottom: 24px; }
          }
        `}
      </style>

      <div className="infinite-carousel-wrapper">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : error ? (
          <Alert variant="warning" className="m-3">
            {error}
          </Alert>
        ) : cupones.length > 0 ? (
          <div className="infinite-carousel">
            {cupones.map((coupon, i) => (
              <Image
                key={`${coupon.id}-${Math.floor(i / cupones.length * 3)}`}
                src={coupon.image}
                alt={coupon.name}
                className="carousel-image"
                onClick={() => {
                  alert(
                    `CÓDIGO: ${coupon.code}\n\n${coupon.description}\n\nDescuento: ${coupon.discount ? coupon.discount + '%' : 'Ver detalles'}`
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <Alert variant="info" className="m-3">
            No hay cupones disponibles.
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;