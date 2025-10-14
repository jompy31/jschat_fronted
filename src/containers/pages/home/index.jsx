import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronRight, Instagram, Linkedin } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Home.css';

const Home = () => {
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  // Floating particles para futurismo
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className="home-container">
      {/* Hero Section – Reducido a ~80vh, parallax y particles */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative h-[80vh] md:h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: 'url(/assets/hero-sports.jpg)' }}
      >
        {/* Overlay futurista */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70"></div>
        <div className="absolute inset-0 bg-[var(--accent-hover)] opacity-10 animate-pulse"></div>
        
        {/* Particles flotantes */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-[var(--accent-primary)] rounded-full opacity-60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Bienvenidos a J SPORT
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl md:text-3xl mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Tu aliado en personalización de productos deportivos y empresariales
          </motion.p>
          <motion.a
            href="/contacto"
            className="group relative inline-flex items-center bg-[var(--accent-primary)] hover:bg-[var(--border-primary)] text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg overflow-hidden"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: 'var(--glow-neon)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <span className="relative z-10">Explora Nuestros Servicios</span>
            <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[var(--accent-hover)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </motion.a>
        </div>
      </motion.section>

      {/* About Us – Reducido py-12, glitch text anim */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className="py-12 md:py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={heroVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 leading-tight relative"
            animate={{ textShadow: ['0 0 5px var(--accent-primary)', '0 0 10px var(--accent-primary)', '0 0 5px var(--accent-primary)'] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            Sobre J SPORT
          </motion.h2>
          <motion.div
            variants={cardVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl leading-relaxed px-4 sm:px-8"
            >
              En J SPORT, nos especializamos en sublimación, impresión láser y personalización de productos deportivos y empresariales. Con años de experiencia y un compromiso con la calidad, ofrecemos soluciones personalizadas que destacan en el mercado.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Services – Reducido gap, más anims en icons */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className="py-12 md:py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={heroVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16"
          >
            Nuestros Servicios
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Sublimación',
                description: 'Impresión de alta calidad para diseños vibrantes y duraderos en uniformes y productos.',
                icon: <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />,
              },
              {
                title: 'Impresión Láser',
                description: 'Acabados precisos y profesionales para detalles complejos en cualquier material.',
                icon: <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />,
              },
              {
                title: 'Personalización',
                description: 'Personaliza tus productos con nombres, números y logotipos únicos.',
                icon: <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />,
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: 'var(--glow-neon)' }}
                className="group relative bg-transparent p-6 sm:p-8 rounded-xl border border-transparent hover:border-[var(--border-primary)] overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-hover)] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <motion.div 
                    className="mx-auto mb-4 sm:mb-6 text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: [0, -180, 0] }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 leading-tight">{service.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Portfolio – Reducido h-48, smoother transitions */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16"
          >
            Nuestro Portafolio
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="portfolio-swiper"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
            >
              {[
                { src: '/assets/portfolio1.jpg', alt: 'Uniforme Deportivo' },
                { src: '/assets/portfolio2.jpg', alt: 'Producto Empresarial' },
                { src: '/assets/portfolio3.jpg', alt: 'Sublimación' },
                { src: '/assets/portfolio4.jpg', alt: 'Impresión Láser' },
              ].map((item, index) => (
                <SwiperSlide key={item.alt}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <img 
                      src={item.src} 
                      alt={item.alt} 
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl group-hover:rounded-2xl transition-all duration-500 shadow-lg hover:shadow-[var(--glow-neon)]" 
                    />
                    <motion.p 
                      className="text-center mt-3 sm:mt-4 text-sm sm:text-lg font-semibold"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                    >
                      {item.alt}
                    </motion.p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* Testimonials – Reducido gap, quote slide-in */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true }}
        className="py-12 md:py-16"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={heroVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 md:mb-16"
          >
            Lo que Dicen Nuestros Clientes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote: 'J SPORT superó nuestras expectativas con uniformes de alta calidad para nuestro equipo.',
                author: 'Juan Pérez, Entrenador Deportivo',
              },
              {
                quote: 'Los regalos personalizados para nuestro evento corporativo fueron un éxito gracias a J SPORT.',
                author: 'Ana Gómez, Organizadora de Eventos',
              },
              {
                quote: 'La sublimación en nuestros productos promocionales fue impecable y entregada a tiempo.',
                author: 'Carlos López, Director de Marketing',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                custom={index}
                variants={cardVariants}
                whileHover={{ scale: 1.02, rotateX: 5 }}
                className="group relative bg-transparent p-6 sm:p-8 rounded-xl border border-transparent hover:border-[var(--border-primary)] overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10"></div>
                <div className="relative z-10">
                  <motion.p 
                    className="text-lg sm:text-xl italic mb-4 sm:mb-6 leading-relaxed relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    "{testimonial.quote}"
                  </motion.p>
                  <motion.p 
                    className="font-bold text-xl sm:text-2xl relative"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {testimonial.author}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action – Reducido py-12, pulse en botón */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-12 md:py-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--accent-primary)]"></div>
        <div className="absolute inset-0 bg-[var(--accent-hover)] opacity-20 animate-pulse"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            ¿Listo para Empezar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Contáctanos hoy para discutir tu proyecto.
          </motion.p>
          <motion.a
            href="/contacto"
            className="group relative inline-flex items-center bg-[var(--accent-primary)] hover:bg-transparent text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-xl border-2 border-transparent hover:border-[var(--accent-primary)] overflow-hidden"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.02, 1] }} // Pulse sutil
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="relative z-10">Contáctanos</span>
            <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[var(--accent-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;