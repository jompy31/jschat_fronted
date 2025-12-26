import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Home.css';
import Foto1 from "../../../assets/img/empresas-subli.jpg";
import Foto2 from "../../../assets/img/sublimacion.jpg";
import Foto3 from "../../../assets/img/impresion-laser.jpg";
import Foto4 from "../../../assets/img/uniformes-deportivo.jpg";
import ProductDataService from '../../../services/products';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductDataService.getAllProducts(token);
        const data = response.data.results || response.data;
        // Mostrar solo 6 productos destacados
        setProducts(data.slice(0, 6));
        setLoading(false);
      } catch (err) {
        setError('Error al cargar productos destacados.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 1.5,
  }));

  const portfolioItems = [
    { src: Foto4, name: 'Uniformes Deportivos Personalizados' },
    { src: Foto1, name: 'Productos Empresariales Sublimados' },
    { src: Foto2, name: 'Sublimación de Alta Calidad' },
    { src: Foto3, name: 'Impresión Láser Precisa' },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative h-[80vh] md:h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: 'url(/assets/hero-sports.jpg)' }}
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60"></div>
        <div className="absolute inset-0 bg-[var(--accent-hover)] opacity-8 animate-pulse-slow"></div>

        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full opacity-50"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{ y: [0, -15, 0], opacity: [0.5, 0.8, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 text-center px-6 md:px-8">
          <motion.h1
            id="hero-title"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 md:mb-6 leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Bienvenidos a J SPORT
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Su socio estratégico en personalización de uniformes deportivos y productos empresariales mediante sublimación innovadora.
          </motion.p>
          <motion.a
            href="/catalogo"
            className="group relative inline-flex items-center bg-[var(--accent-primary)] hover:bg-[var(--border-primary)] text-white font-semibold py-3 px-7 md:py-4 md:px-9 rounded-full text-base md:text-lg overflow-hidden transition-all duration-300"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.03, boxShadow: 'var(--glow-neon)' }}
            whileTap={{ scale: 0.97 }}
            aria-label="Explorar Nuestros Servicios"
          >
            <span className="relative z-10">Explorar Nuestros Servicios</span>
            <ChevronRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[var(--accent-hover)] opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
          </motion.a>
        </div>
      </motion.section>

      {/* About Section - TEXTO 100% VISIBLE EN MÓVILES Y ESCRITORIO */}
<motion.section
  initial="hidden"
  whileInView="visible"
  variants={containerVariants}
  viewport={{ once: true, margin: "-100px" }}
  className="section-spacing bg-white dark:bg-gray-900/80 backdrop-blur-sm py-12 sm:py-16"
  aria-labelledby="about-title"
>
  <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl">
    <motion.h2
      id="about-title"
      variants={heroVariants}
      className="section-title text-center text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 sm:mb-8 text-gray-900 dark:text-white"
    >
      Sobre J SPORT
    </motion.h2>

    <motion.div
      variants={cardVariants}
      className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-sm xs:text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-200 text-center max-w-4xl mx-auto"
      >
        En J SPORT, nos dedicamos a la excelencia en sublimación, impresión láser y personalización de productos deportivos y empresariales. Con un enfoque en innovación y calidad superior, entregamos soluciones a medida que elevan su marca y rendimiento.
      </motion.p>
    </motion.div>
  </div>
</motion.section>

     {/* === BENEFICIOS DE LA SUBLIMACIÓN - 3 COLUMNAS EN ESCRITORIO === */}
<motion.section
  initial="hidden"
  whileInView="visible"
  variants={containerVariants}
  viewport={{ once: true, margin: "-100px" }}
  className="section-spacing"
  aria-labelledby="features-title"
>
  <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
    <motion.h2
      id="features-title"
      variants={heroVariants}
      className="section-title text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 px-2"
    >
      Beneficios de la Sublimación en Uniformes
    </motion.h2>

    {/* GRID RESPONSIVO: 1 columna móvil → 3 en desktop */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
      {[
        {
          title: 'Durabilidad Excepcional',
          description: 'Nuestros procesos de sublimación aseguran colores vibrantes que resisten lavados y uso intensivo, ideal para entornos deportivos exigentes.',
          icon: <ChevronRight className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />,
        },
        {
          title: 'Diseños Ilimitados',
          description: 'Personalice con gradientes, patrones complejos y logotipos detallados sin restricciones, fusionando creatividad e innovación tecnológica.',
          icon: <ChevronRight className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />,
        },
        {
          title: 'Confort y Rendimiento',
          description: 'Telas transpirables y ligeras sublimadas para máximo confort, mejorando el rendimiento atlético y la productividad empresarial.',
          icon: <ChevronRight className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />,
        },
      ].map((feature, index) => (
        <motion.div
          key={feature.title}
          custom={index}
          variants={cardVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative bg-white dark:bg-gray-800/70 backdrop-blur-sm p-4 xs:p-5 sm:p-6 md:p-7 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[var(--accent-primary)] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-hover)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 text-center space-y-3 sm:space-y-4">
            <motion.div
              className="mx-auto text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {feature.icon}
            </motion.div>

            <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold leading-tight px-1 text-gray-900 dark:text-white">
              {feature.title}
            </h3>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed opacity-85 text-gray-600 dark:text-gray-300 px-2">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

      {/* === NUESTROS SERVICIOS - 3 COLUMNAS EN ESCRITORIO === */}
<motion.section
  initial="hidden"
  whileInView="visible"
  variants={containerVariants}
  viewport={{ once: true, margin: "-100px" }}
  className="section-spacing bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16"
  aria-labelledby="services-title"
>
  <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-7xl">
    <motion.h2
      id="services-title"
      variants={heroVariants}
      className="section-title text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 text-gray-900 dark:text-white px-2"
    >
      Nuestros Servicios
    </motion.h2>

    {/* GRID RESPONSIVO: 1 columna móvil → 3 en desktop */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {[
        {
          title: 'Sublimación Avanzada',
          description: 'Técnicas de impresión de vanguardia para diseños vibrantes y duraderos en uniformes y accesorios deportivos.',
          icon: <ChevronRight className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />,
        },
        {
          title: 'Impresión Láser de Precisión',
          description: 'Acabados detallados y profesionales para materiales diversos, garantizando calidad superior en cada proyecto.',
          icon: <ChevronRight className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />,
        },
        {
          title: 'Personalización Integral',
          description: 'Soluciones a medida con nombres, números y logotipos, adaptadas a sus necesidades específicas.',
          icon: <ChevronRight className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9" />,
        },
      ].map((service, index) => (
        <motion.div
          key={service.title}
          custom={index}
          variants={cardVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative bg-white dark:bg-gray-800/70 backdrop-blur-sm p-4 xs:p-5 sm:p-6 md:p-7 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[var(--accent-primary)] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-hover)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 text-center space-y-3 sm:space-y-4">
            <motion.div
              className="mx-auto text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {service.icon}
            </motion.div>

            <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold leading-tight px-1 text-gray-900 dark:text-white">
              {service.title}
            </h3>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed opacity-85 text-gray-600 dark:text-gray-300 px-2">
              {service.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>

  {/* Portfolio Section - 100% RESPONSIVO SIN CORTES */}
<section className="section-spacing" aria-labelledby="products-title">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-7xl">
          {/* TÍTULO RESPONSIVO */}
          <motion.h2
            id="products-title"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-title text-center font-extrabold mb-6 sm:mb-8 px-2
                       text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                       leading-tight"
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 4.5rem)',
              lineHeight: '1.2'
            }}
          >
            Productos Destacados
          </motion.h2>

          {/* CARRUSEL - DE DERECHA A IZQUIERDA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="products-swiper"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              reverseDirection={true} // ← MUEVE DE DERECHA A IZQUIERDA
              autoplay={{ 
                delay: 3000, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: true
              }}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                dynamicMainBullets: 3
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 12 },
                480: { slidesPerView: 1.1, spaceBetween: 14 },
                640: { slidesPerView: 1.3, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 3, spaceBetween: 28 },
              }}
              className="pb-10 sm:pb-12"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id} className="flex flex-col items-center">
                  <motion.div
                    custom={index}
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer w-full"
                    onClick={() => navigate('/catalogo')}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800/50 shadow-md hover:shadow-xl transition-all duration-400 glass-neon">
                      {product.design_file ? (
                        <img
                          src={product.design_file}
                          alt={product.name}
                          className="w-full h-48 xs:h-52 sm:h-56 md:h-64 lg:h-72 object-cover 
                                     group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-48 xs:h-52 sm:h-56 md:h-64 lg:h-72 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                          Sin imagen
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                    </div>
                    
                    <motion.p
                      className="text-center mt-3 text-xs xs:text-sm sm:text-base md:text-lg 
                                 font-medium text-gray-700 dark:text-gray-200 px-2"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      style={{
                        fontSize: 'clamp(0.75rem, 3vw, 1.1rem)'
                      }}
                    >
                      {product.name}
                    </motion.p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Controles personalizados */}
            <div className="swiper-button-prev !text-[var(--accent-primary)] !w-8 !h-8 xs:!w-9 xs:!h-9 sm:!w-10 sm:!h-10 
                            after:!text-xs xs:after:!text-sm after:font-bold 
                            !left-2 xs:!left-3 sm:!left-4" />
            <div className="swiper-button-next !text-[var(--accent-primary)] !w-8 !h-8 xs:!w-9 xs:!h-9 sm:!w-10 sm:!h-10 
                            after:!text-xs xs:after:!text-sm after:font-bold 
                            !right-2 xs:!right-3 sm:!right-4" />
          </motion.div>

          {/* Botón Ver Todo */}
          <div className="text-center mt-8">
            <motion.a
              href="/catalogo"
              className="inline-flex items-center bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Ver Todo el Catálogo <ChevronRight className="ml-2 h-5 w-5" />
            </motion.a>
          </div>
        </div>
      </section>

     {/* Testimonials Section - 100% RESPONSIVO SIN DESBORDE */}
<motion.section
  initial="hidden"
  whileInView="visible"
  variants={containerVariants}
  viewport={{ once: true, margin: "-100px" }}
  className="section-spacing bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 sm:py-16"
  aria-labelledby="testimonials-title"
>
  <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-7xl">
    {/* TÍTULO RESPONSIVO */}
    <motion.h2
      id="testimonials-title"
      variants={heroVariants}
      className="section-title text-center font-extrabold mb-6 sm:mb-8 
                 text-2xl xs:text-3xl sm:text-4xl md:text-5xl
                 text-gray-900 dark:text-white
                 leading-tight tracking-tight
                 px-3 xs:px-4 sm:px-6"
      style={{
        fontSize: 'clamp(1.6rem, 5.5vw, 3.8rem)',
        lineHeight: '1.15',
        wordBreak: 'break-word'
      }}
    >
      Lo que Dicen Nuestros Clientes
    </motion.h2>

    {/* GRID RESPONSIVO: 1 columna móvil → 2-3 en desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {[
        {
          quote: "J SPORT ha transformado nuestras expectativas con uniformes sublimados de calidad excepcional, diseñados para durar en competiciones intensas.",
          author: "Juan Pérez, Entrenador Deportivo Profesional",
        },
        {
          quote: "Los productos personalizados de J SPORT elevaron nuestro evento corporativo, combinando innovación y precisión en cada detalle.",
          author: "Ana Gómez, Directora de Eventos Corporativos",
        },
        {
          quote: "La sublimación impecable y entrega puntual de J SPORT han sido clave para nuestras campañas promocionales exitosas.",
          author: "Carlos López, Director de Marketing Estratégico",
        },
      ].map((testimonial, index) => (
        <motion.div
          key={testimonial.author}
          custom={index}
          variants={cardVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          className="group relative bg-white dark:bg-gray-800/70 backdrop-blur-sm 
                     p-4 xs:p-5 sm:p-6 md:p-7 
                     rounded-xl border border-gray-200 dark:border-gray-700 
                     hover:border-[var(--accent-primary)] 
                     overflow-hidden transition-all duration-300 
                     shadow-sm hover:shadow-lg
                     flex flex-col h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-hover)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 flex flex-col flex-1 space-y-4">
            <motion.p
              className="text-xs xs:text-sm sm:text-base md:text-lg 
                         italic leading-relaxed 
                         text-gray-700 dark:text-gray-200
                         flex-1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                fontSize: 'clamp(0.75rem, 3.2vw, 1.1rem)',
                lineHeight: '1.5'
              }}
            >
              "{testimonial.quote}"
            </motion.p>

            <motion.p
              className="font-semibold 
                         text-xs xs:text-sm sm:text-base md:text-lg 
                         text-gray-900 dark:text-white
                         mt-auto"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontSize: 'clamp(0.8rem, 3.5vw, 1.15rem)'
              }}
            >
              {testimonial.author}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</motion.section>
     {/* Call to Action - 100% RESPONSIVO SIN DESBORDE */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  className="section-spacing relative overflow-hidden cta-section bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-hover)] dark:from-blue-900 dark:to-purple-900 py-16 sm:py-20"
  aria-labelledby="cta-title"
>
  <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-7xl text-center relative z-10">
    {/* TÍTULO RESPONSIVO CON CLAMP Y BREAK */}
    <motion.h2
      id="cta-title"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="font-bold mb-3 md:mb-5 leading-tight tracking-tight
                 text-white drop-shadow-lg
                 px-2 xs:px-3 sm:px-4
                 break-words hyphens-auto"
      style={{
        fontSize: 'clamp(1.8rem, 6.5vw, 4rem)',
        lineHeight: '1.15',
        wordBreak: 'break-word',
        overflowWrap: 'break-word'
      }}
    >
      ¿Listo para Empezar Su Proyecto?
    </motion.h2>

    {/* SUBTÍTULO RESPONSIVO */}
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="text-white/90 mb-5 md:mb-7 max-w-3xl mx-auto leading-relaxed
                 px-2 xs:px-3 sm:px-4
                 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl"
      style={{
        fontSize: 'clamp(0.85rem, 3.5vw, 1.3rem)',
        lineHeight: '1.5'
      }}
    >
      Contáctenos hoy para una consulta personalizada y descubra cómo la sublimación innovadora puede elevar su marca.
    </motion.p>

    {/* BOTÓN RESPONSIVO */}
    <motion.a
      href="/contacto"
      className="group relative inline-flex items-center 
                 bg-white text-[var(--accent-primary)] 
                 hover:bg-transparent hover:text-white
                 font-semibold py-3 px-6 xs:py-3.5 xs:px-7 sm:py-4 sm:px-9 
                 rounded-full text-sm xs:text-base sm:text-lg 
                 border-2 border-white/30 hover:border-white
                 overflow-hidden transition-all duration-300
                 shadow-lg hover:shadow-2xl"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Contáctenos Ahora"
    >
      <span className="relative z-10 flex items-center">
        Contáctenos Ahora
        <ChevronRight className="ml-2 h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
    </motion.a>
  </div>

  {/* EFECTO DE BRILLO ANIMADO */}
  <div className="absolute inset-0 opacity-20">
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/20 animate-shine"></div>
  </div>
</motion.section>
    </div>
  );
};

export default Home;