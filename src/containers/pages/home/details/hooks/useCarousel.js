import { useState, useEffect, useRef } from "react";

const useCarousel = (coupons) => {
  const [carouselPosition, setCarouselPosition] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (coupons.length <= 3) {
      const interval = setInterval(() => {
        setCarouselPosition((prev) => {
          const maxPosition = -(coupons.length * 33.33);
          if (prev <= maxPosition) {
            return 0;
          }
          return prev - 0.1;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        setCarouselPosition((prev) => {
          const maxPosition = -((coupons.length - 3) * 33.33);
          if (prev <= maxPosition) {
            return 0;
          }
          return prev - 0.1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [coupons.length]);

  return { carouselPosition, carouselRef };
};

export default useCarousel;
