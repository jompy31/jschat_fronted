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
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.2 },
    }),
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: 'url(/assets/hero-sports.jpg)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Bienvenidos a J SPORT</h1>
          <p className="text-xl md:text-2xl mb-8">Tu aliado en personalización de productos deportivos y empresariales</p>
          <a
            href="/contacto"
            className="bg-jsport-red hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"
          >
            Explora Nuestros Servicios <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </motion.section>

      {/* About Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-jsport-blue"
          >
            Sobre J SPORT
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg text-center max-w-3xl mx-auto text-gray-700"
          >
            En J SPORT, nos especializamos en sublimación, impresión láser y personalización de productos deportivos y empresariales. Con años de experiencia y un compromiso con la calidad, ofrecemos soluciones personalizadas que destacan en el mercado.
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-jsport-blue">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Sublimación',
                description: 'Impresión de alta calidad para diseños vibrantes y duraderos en uniformes y productos.',
                icon: <ChevronRight className="h-8 w-8 text-jsport-red" />,
              },
              {
                title: 'Impresión Láser',
                description: 'Acabados precisos y profesionales para detalles complejos en cualquier material.',
                icon: <ChevronRight className="h-8 w-8 text-jsport-red" />,
              },
              {
                title: 'Personalización',
                description: 'Personaliza tus productos con nombres, números y logotipos únicos.',
                icon: <ChevronRight className="h-8 w-8 text-jsport-red" />,
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-jsport-blue">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-jsport-blue">Nuestro Portafolio</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="portfolio-swiper"
          >
            {[
              { src: '/assets/portfolio1.jpg', alt: 'Uniforme Deportivo' },
              { src: '/assets/portfolio2.jpg', alt: 'Producto Empresarial' },
              { src: '/assets/portfolio3.jpg', alt: 'Sublimación' },
              { src: '/assets/portfolio4.jpg', alt: 'Impresión Láser' },
            ].map((item) => (
              <SwiperSlide key={item.alt}>
                <img src={item.src} alt={item.alt} className="w-full h-64 object-cover rounded-lg" />
                <p className="text-center mt-2 text-gray-700">{item.alt}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-jsport-blue">Lo que Dicen Nuestros Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-lg italic mb-4 text-gray-600">"{testimonial.quote}"</p>
                <p className="font-bold text-jsport-blue">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-jsport-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            ¿Listo para Empezar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl mb-8"
          >
            Contáctanos hoy para discutir tu proyecto.
          </motion.p>
          <a
            href="/contacto"
            className="bg-jsport-red hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"
          >
            Contáctanos <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;