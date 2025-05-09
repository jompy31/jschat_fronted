import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.css';
import { useMediaQuery } from 'react-responsive';
import slider1 from '../../../../assets/slider1.jpg';
import slider2 from '../../../../assets/slider2.jpg';
import slider3 from '../../../../assets/slider3.jpg';
import slider4 from '../../../../assets/slider4.jpg';
import slider5 from '../../../../assets/slider5.jpg';
import "./Carousel.css";

const Carousel1 = () => {
  // Definir diferentes breakpoints
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 481px) and (max-width: 768px)' });
  const isSmallDesktop = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });
  const isLargeDesktop = useMediaQuery({ query: '(min-width: 1025px)' });

  // Definir configuraciones del carrusel según el tamaño de la pantalla
  const carouselSettings = {
    centerMode: false,
    emulateTouch: true,
    infiniteLoop: true,
    showIndicators: false,
    showStatus: false,
    showThumbs: false,
    autoPlay: true,
    interval: 4000,
    stopOnHover: false,
  };

  return (
    <div className="imageContainerStyle">
      <Carousel {...carouselSettings}>
        {[...Array(10)].map((_, repeatIndex) =>
          [slider1, slider2, slider3, slider4, slider5].map((image, index) => (
            <div key={`${repeatIndex}-${index}`} style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                loading="lazy"
                style={{ width: "100vw", objectFit: "contain" }}
              />
            </div>
          ))
        )}
      </Carousel>
    </div>
  );
};

export default Carousel1;