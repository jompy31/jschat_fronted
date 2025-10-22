import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './SobreNosotros.css';

const SobreNosotros = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.2 },
    }),
  };

  return (
    <div className="sobre-nosotros-container">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
        style={{ backgroundImage: 'url(/assets/sobre-nosotros-hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-jsport-blue opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conoce a J SPORT</h1>
          <p className="text-lg md:text-xl mb-6">Tu aliado en personalización de productos deportivos y empresariales</p>
          <Link
            to="/contacto"
            className="btn-futurista bg-jsport-red hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"
          >
            Contáctanos <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.section>

      {/* Nuestra Historia */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-jsport-blue text-center mb-8">Nuestra Historia</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center motion-visible">
            Fundada en 2010, J SPORT nació con la pasión de transformar ideas en productos únicos. Desde nuestros inicios en Costa Rica, hemos crecido hasta convertirnos en líderes en sublimación, impresión láser y personalización, trabajando con equipos deportivos y empresas para dar vida a sus visiones.
          </p>
        </div>
      </motion.section>

      {/* Misión y Visión */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-jsport-blue text-center mb-12">Misión y Visión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={cardVariants}
              custom={0}
              whileInView="visible"
              viewport={{ once: true }}
              className="card-futurista p-6 text-center motion-visible"
            >
              <h3 className="text-2xl font-semibold text-jsport-red mb-4">Misión</h3>
              <p className="text-lg text-gray-200">
                Ofrecer productos personalizados de alta calidad utilizando tecnologías avanzadas de sublimación e impresión láser, satisfaciendo las necesidades de nuestros clientes en los ámbitos deportivo y empresarial.
              </p>
            </motion.div>
            <motion.div
              variants={cardVariants}
              custom={1}
              whileInView="visible"
              viewport={{ once: true }}
              className="card-futurista p-6 text-center motion-visible"
            >
              <h3 className="text-2xl font-semibold text-jsport-red mb-4">Visión</h3>
              <p className="text-lg text-gray-200">
                Ser el referente en personalización de productos en Costa Rica, reconocidos por nuestra innovación, calidad y compromiso con la satisfacción del cliente.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Nuestros Valores */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-jsport-blue text-center mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Calidad', description: 'Nos comprometemos a entregar productos de la más alta calidad en cada proyecto.' },
              { title: 'Innovación', description: 'Utilizamos tecnologías de vanguardia para ofrecer soluciones creativas y únicas.' },
              { title: 'Pasión', description: 'Trabajamos con entusiasmo, reflejando el espíritu de nuestros clientes en cada producto.' },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                custom={index}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="card-futurista p-6 text-center motion-visible"
              >
                <h3 className="text-xl font-semibold text-jsport-red mb-2">{value.title}</h3>
                <p className="text-gray-200">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Qué Hacemos */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-jsport-blue text-center mb-12">Qué Hacemos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Sublimación', description: 'Impresión de alta calidad para diseños vibrantes y duraderos en uniformes y productos.' },
              { title: 'Impresión Láser', description: 'Acabados precisos y profesionales para detalles complejos en cualquier material.' },
              { title: 'Personalización', description: 'Personaliza tus productos con nombres, números y logotipos únicos.' },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="card-futurista p-6 text-center motion-visible"
              >
                <h3 className="text-xl font-semibold text-jsport-red mb-4">{service.title}</h3>
                <p className="text-gray-200">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonios */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-jsport-blue text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: 'J SPORT superó nuestras expectativas con uniformes de alta calidad para nuestro equipo.', author: 'Juan Pérez, Entrenador Deportivo' },
              { quote: 'Los regalos personalizados para nuestro evento corporativo fueron un éxito gracias a J SPORT.', author: 'Ana Gómez, Organizadora de Eventos' },
              { quote: 'La sublimación en nuestros productos promocionales fue impecable y entregada a tiempo.', author: 'Carlos López, Director de Marketing' },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                custom={index}
                variants={cardVariants}
                whileInView="visible"
                viewport={{ once: true }}
                className="card-futurista p-6 text-center motion-visible"
              >
                <p className="text-gray-200 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold text-jsport-blue">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default SobreNosotros;
