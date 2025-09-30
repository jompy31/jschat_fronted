import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ChevronRight } from 'lucide-react';
import promotionsData from './promotions.json';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Promociones.css';

const Promociones = () => {
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

  return (
    <div className="promociones-container">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        className="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
        style={{ backgroundImage: 'url(/assets/promo-hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-jsport-blue opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Promociones Exclusivas</h1>
          <p className="text-lg md:text-xl mb-6">Descubre nuestras ofertas en productos deportivos y empresariales personalizados</p>
          <a
            href="/contacto"
            className="bg-jsport-red hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center"
          >
            Contáctanos <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </motion.section>

      {/* Featured Promotions Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-jsport-blue">
            Ofertas Destacadas
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="promo-swiper"
          >
            {promotionsData.map((promo) => (
              <SwiperSlide key={promo.id}>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <img
                    src={promo.products[0]?.image || '/assets/placeholder.jpg'}
                    alt={promo.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2 text-jsport-blue">{promo.name}</h3>
                  <p className="text-gray-600 mb-4">{promo.description}</p>
                  <p className="text-sm text-gray-500">
                    Descuento: {promo.discount}% | Compra mínima: ${promo.min_amount}
                  </p>
                  <a
                    href="/login"
                    className="mt-4 inline-flex items-center text-jsport-red hover:text-red-600 font-semibold"
                  >
                    Ver Oferta <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* All Promotions Grid */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-jsport-blue">
            Todas las Promociones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotionsData.map((promo, index) => (
              <motion.div
                key={promo.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={promo.products[0]?.image || '/assets/placeholder.jpg'}
                  alt={promo.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-jsport-blue">{promo.name}</h3>
                <p className="text-gray-600 mb-4">{promo.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Descuento: {promo.discount}% | Compra mínima: ${promo.min_amount}
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-jsport-blue">Productos Incluidos:</h4>
                  <ul className="list-disc list-inside text-gray-600">
                    {promo.products.map((product) => (
                      <li key={product.id}>{product.name} - ${product.price}</li>
                    ))}
                  </ul>
                </div>
                <a
                  href="/login"
                  className="inline-flex items-center bg-jsport-red hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Aprovechar Oferta <ChevronRight className="ml-2 h-4 w-4" />
                </a>
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
            ¡No Pierdas Estas Ofertas!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl mb-8"
          >
            Inicia sesión o contáctanos para personalizar tus productos con descuentos exclusivos.
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

export default Promociones;