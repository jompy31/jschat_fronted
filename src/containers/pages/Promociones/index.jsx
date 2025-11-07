import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Promociones.css';
import ProductDataService from '../../../services/products';

const Promociones = () => {
  const [promotions, setPromotions] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [minDiscount, setMinDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Token opcional
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener promociones
        const promoResponse = await ProductDataService.getAllPromotions(token);
        setPromotions(promoResponse.data.results || promoResponse.data);

        // Obtener tipos de productos para filtro
        const typesResponse = await ProductDataService.getAllProductTypes(token);
        setProductTypes(typesResponse.data.results || typesResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Error al cargar las promociones o tipos de productos.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filtrar promociones
  const filteredPromotions = promotions.filter(promo => {
    const typeMatch = !selectedType || promo.products.some(product => 
      product.product_type && product.product_type.id === parseInt(selectedType)
    );
    const discountMatch = promo.discount >= minDiscount;
    return typeMatch && discountMatch;
  });

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.2 },
    }),
  };

  if (loading) {
    return <div>Cargando promociones...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="promociones-container">
      {/* === HERO SECTION - RESPONSIVO === */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="promo-hero-section"
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            style={{
              fontSize: 'clamp(2rem, 7vw, 4.5rem)',
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            Promociones Exclusivas
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
              lineHeight: '1.5'
            }}
          >
            Descubre nuestras ofertas en productos deportivos y empresariales personalizados
          </motion.p>
          <motion.a
            href="/contacto"
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            Contáctanos <ChevronRight className="ml-2 h-5 w-5" />
          </motion.a>
        </div>
      </motion.section>

      {/* === FILTROS === */}
      <section className="promo-filters-section">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.2rem)'
            }}
          >
            Filtrar Promociones
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Por Tipo de Producto</label>
              <select 
                className="form-select w-full"
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                {productTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descuento Mínimo (%)</label>
              <input 
                type="number" 
                className="form-control w-full"
                min="0" 
                max="100" 
                value={minDiscount} 
                onChange={(e) => setMinDiscount(parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* === CARRUSEL - RESPONSIVO === */}
      <section className="promo-featured-section">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.2rem)'
            }}
          >
            Ofertas Destacadas
          </motion.h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
              dynamicMainBullets: 3
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 12 },
              480: { slidesPerView: 1.1, spaceBetween: 14 },
              640: { slidesPerView: 1.3, spaceBetween: 16 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="promo-swiper pb-10"
          >
            {filteredPromotions.map((promo) => (
              <SwiperSlide key={promo.id}>
                <motion.div
                  className="promo-card"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="promo-image-container">
                    <img
                      src={promo.products[0]?.design_file || '/assets/placeholder.jpg'}
                      alt={promo.name}
                      className="promo-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="promo-content">
                    <h3 className="promo-title text-sm xs:text-base sm:text-lg md:text-xl">
                      {promo.name}
                    </h3>
                    <p className="promo-description text-xs xs:text-sm sm:text-base opacity-85">
                      {promo.description}
                    </p>
                    <div className="promo-details text-xs xs:text-sm">
                      <span className="promo-discount">{promo.discount}% OFF</span>
                      <span className="promo-min">Mín: ${promo.min_amount}</span>
                    </div>
                    <a href="/login" className="promo-link text-xs xs:text-sm">
                      Ver Oferta <ChevronRight className="ml-1 h-3 w-3 xs:h-4 xs:w-4" />
                    </a>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Controles */}
          <div className="swiper-button-prev !text-white !w-8 !h-8 xs:!w-9 xs:!h-9 sm:!w-10 sm:!h-10 after:!text-xs xs:after:!text-sm !left-1 xs:!left-2" />
          <div className="swiper-button-next !text-white !w-8 !h-8 xs:!w-9 xs:!h-9 sm:!w-10 sm:!h-10 after:!text-xs xs:after:!text-sm !right-1 xs:!right-2" />
        </div>
      </section>

      {/* === GRID - RESPONSIVO === */}
      <section className="promo-grid-section">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.2rem)'
            }}
          >
            Todas las Promociones
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPromotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="promo-grid-card"
              >
                <div className="promo-image-container">
                  <img
                    src={promo.products[0]?.design_file || '/assets/placeholder.jpg'}
                    alt={promo.name}
                    className="promo-image"
                    loading="lazy"
                  />
                </div>
                <div className="promo-content p-3 xs:p-4 sm:p-5">
                  <h3 className="promo-title text-sm xs:text-base sm:text-lg md:text-xl">
                    {promo.name}
                  </h3>
                  <p className="promo-description text-xs xs:text-sm sm:text-base opacity-85">
                    {promo.description}
                  </p>
                  <div className="promo-details text-xs xs:text-sm">
                    <span className="promo-discount">{promo.discount}% OFF</span>
                    <span className="promo-min">Mín: ${promo.min_amount}</span>
                  </div>
                  <div className="promo-products mt-3">
                    <h4 className="products-title text-xs xs:text-sm font-semibold">
                      Productos Incluidos:
                    </h4>
                    <ul className="products-list text-xs xs:text-sm">
                      {promo.products.map((product) => (
                        <li key={product.id} className="product-item">
                          {product.name} - ${product.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="/login" className="promo-cta text-xs xs:text-sm mt-3">
                    Aprovechar Oferta <ChevronRight className="ml-1 h-3 w-3 xs:h-4 xs:w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CTA FINAL - RESPONSIVO === */}
      <section className="promo-cta-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="cta-content px-3 xs:px-4 sm:px-6"
        >
          <motion.h2 
            className="cta-title"
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 3.5rem)'
            }}
          >
            ¡No Pierdas Estas Ofertas!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="cta-subtitle"
            style={{
              fontSize: 'clamp(0.9rem, 3.5vw, 1.2rem)'
            }}
          >
            Inicia sesión o contáctanos para personalizar tus productos con descuentos exclusivos.
          </motion.p>
          <motion.a
            href="/contacto"
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Contáctanos Ahora <ChevronRight className="ml-2 h-5 w-5" />
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
};

export default Promociones;