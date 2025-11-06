import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './SobreNosotros.css';

const SobreNosotros = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
    }),
  };

  const values = [
    { title: 'Calidad', description: 'Nos comprometemos a entregar productos de la más alta calidad en cada proyecto.' },
    { title: 'Innovación', description: 'Utilizamos tecnologías de vanguardia para ofrecer soluciones creativas y únicas.' },
    { title: 'Pasión', description: 'Trabajamos con entusiasmo, reflejando el espíritu de nuestros clientes en cada producto.' },
  ];

  const services = [
    { title: 'Sublimación', description: 'Impresión de alta calidad para diseños vibrantes y duraderos en uniformes y productos.' },
    { title: 'Impresión Láser', description: 'Acabados precisos y profesionales para detalles complejos en cualquier material.' },
    { title: 'Personalización', description: 'Personaliza tus productos con nombres, números y logotipos únicos.' },
  ];

  const testimonials = [
    { quote: 'J SPORT superó nuestras expectativas con uniformes de alta calidad para nuestro equipo.', author: 'Juan Pérez, Entrenador Deportivo' },
    { quote: 'Los regalos personalizados para nuestro evento corporativo fueron un éxito gracias a J SPORT.', author: 'Ana Gómez, Organizadora de Eventos' },
    { quote: 'La sublimación en nuestros productos promocionales fue impecable y entregada a tiempo.', author: 'Carlos López, Director de Marketing' },
  ];

  return (
    <div className="sobre-nosotros-container">
      {/* === HERO - RESPONSIVO === */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="hero-section"
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
            Conoce a J SPORT
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
              lineHeight: '1.6'
            }}
          >
            Tu aliado en personalización de productos deportivos y empresariales
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/contacto" className="hero-cta">
              Contáctanos <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* === HISTORIA === */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="section historia-section"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)',
              wordBreak: 'break-word'
            }}
          >
            Nuestra Historia
          </h2>
          <p className="section-text max-w-3xl mx-auto text-center text-sm xs:text-base sm:text-lg leading-relaxed">
            Fundada en 2010, J SPORT nació con la pasión de transformar ideas en productos únicos. Desde nuestros inicios en Costa Rica, hemos crecido hasta convertirnos en líderes en sublimación, impresión láser y personalización, trabajando con equipos deportivos y empresas para dar vida a sus visiones.
          </p>
        </div>
      </motion.section>

      {/* === MISIÓN Y VISIÓN === */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="section mission-vision-section"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)'
            }}
          >
            Misión y Visión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { title: 'Misión', text: 'Ofrecer productos personalizados de alta calidad utilizando tecnologías avanzadas de sublimación e impresión láser, satisfaciendo las necesidades de nuestros clientes en los ámbitos deportivo y empresarial.' },
              { title: 'Visión', text: 'Ser el referente en personalización de productos en Costa Rica, reconocidos por nuestra innovación, calidad y compromiso con la satisfacción del cliente.' }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="value-card p-4 xs:p-5 sm:p-6"
              >
                <h3 className="value-title text-lg xs:text-xl sm:text-2xl">{item.title}</h3>
                <p className="value-text text-xs xs:text-sm sm:text-base leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* === VALORES === */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="section values-section"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)'
            }}
          >
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                custom={index}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="value-card p-4 xs:p-5 sm:p-6"
              >
                <h3 className="value-title text-lg xs:text-xl sm:text-2xl">{value.title}</h3>
                <p className="value-text text-xs xs:text-sm sm:text-base leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* === QUÉ HACEMOS === */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="section services-section"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)'
            }}
          >
            Qué Hacemos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="value-card p-4 xs:p-5 sm:p-6"
              >
                <h3 className="value-title text-lg xs:text-xl sm:text-2xl break-words">
                  {service.title}
                </h3>
                <p className="value-text text-xs xs:text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* === TESTIMONIOS === */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="section testimonials-section"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3.5rem)'
            }}
          >
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                custom={index}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="testimonial-card p-4 xs:p-5 sm:p-6"
              >
                <p className="testimonial-quote italic text-xs xs:text-sm sm:text-base leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="testimonial-author font-semibold text-xs xs:text-sm sm:text-base mt-3">
                  {testimonial.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default SobreNosotros;