import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // 👈 Para animaciones futuristas innovadoras
import { connect } from 'react-redux';
import logo from '../../assets/LOGO_cuadrado.png';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import publicidadData from '../json/publicidad.json';
import "../../components/navigation/Footer.css";

const navigation = {
  solutions: [{ name: 'Preguntas frecuentes', href: '/faq' }],
  support: [{ name: 'Contactenos', href: '/contacto' }],
  company: [
    { name: "Catálogo", description: "Explora nuestra colección de productos deportivos", href: "/catalogo", icon: "Package" },
    { name: "Promociones", description: "Descubre nuestras ofertas exclusivas", href: "/promociones", icon: "Star" },
    { name: "Sobre Nosotros", description: "Conoce más sobre J SPORT", href: "/sobre-nosotros", icon: "Info" },
    { name: "Contacto", description: "Ponte en contacto con nosotros", href: "/contacto", icon: "Mail" },
    { name: "Tienda", description: "Accede a nuestra tienda en línea", href: "/login", icon: "ShoppingCart" },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/abcupon',
      icon: (props) => (
        <img
          src="https://img.icons8.com/?size=100&id=xuvGCOXi8Wyg&format=png&color=000000"
          alt="LinkedIn"
          {...props}
          style={{ width: '30px', height: '30px' }}
        />
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/abcupon_ventas',
      icon: (props) => (
        <img
          src="https://img.icons8.com/?size=100&id=32323&format=png&color=000000"
          alt="Instagram"
          {...props}
          style={{ width: '30px', height: '30px' }}
        />
      ),
    },
    {
      name: 'WhatsApp Business',
      href: 'https://wa.link/2xgfs3',
      icon: (props) => (
        <img
          src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000"
          alt="WhatsApp"
          {...props}
          style={{ width: '30px', height: '30px' }}
        />
      ),
    },
  ],
};

function Footer() {
  const [publicidadLinks, setPublicidadLinks] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMini = useMediaQuery({ query: '(max-width: 340px)' });

  useEffect(() => {
    setPublicidadLinks(publicidadData.categorias);
  }, []);

  if (!publicidadLinks || !Array.isArray(publicidadLinks)) {
    return <div>Error: No se pudieron cargar las categorías.</div>;
  }

  // Filtrar solo la categoría de Facebook
  const facebookCategory = publicidadLinks.find((cat) => cat.nombre === 'Facebook');
  const fanPages = facebookCategory?.subcategorias.find(
    (sub) => sub.nombre === 'Fan Page propias'
  )?.subsubcategorias?.flatMap((subsub) => subsub.grupos) || [];
  const commercialGroups = facebookCategory?.subcategorias.find(
    (sub) => sub.nombre === 'Grupos comerciales directos'
  )?.subsubcategorias?.flatMap((subsub) => subsub.grupos) || [];

  // Ordenar por número
  const sortedFanPages = [...fanPages].sort((a, b) => {
    const numA = parseFloat(a.numero) || 0;
    const numB = parseFloat(b.numero) || 0;
    return numA - numB;
  });
  const sortedCommercialGroups = [...commercialGroups].sort((a, b) => {
    const numA = parseFloat(a.numero) || 0;
    const numB = parseFloat(b.numero) || 0;
    return numA - numB;
  });

  // Anim variants – Stagger futurista innovador
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }, // Ease futurista
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      aria-labelledby="footer-heading"
      className="footer" // 👈 Clase para CSS vars globales
    >
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>
      <div className="mx-auto max-w-full py-8 px-4 sm:px-6 lg:py-10 lg:px-8"> {/* Padding pro */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8"> {/* Gap pro */}
          <motion.div variants={itemVariants} className="space-y-6 xl:col-span-1"> {/* Space pro */}
            <img src={logo} width={250} height={250} className="footer-logo" alt="Logo" /> {/* Tamaño/pos fijo */}
            <motion.div variants={itemVariants} className="flex space-x-6 justify-center"> {/* Space pro */}
              {navigation.social.map((item, index) => (
                <motion.a 
                  key={item.name} 
                  href={item.href} 
                  className="footer-social-link group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.15, rotate: [0, 360, 0] }} // Rotate futurista innovador
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <item.icon className="footer-social-icon" />
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-[var(--accent-primary)] opacity-0 group-hover:opacity-40"
                    initial={{ scale: 0 }}
                    animate={{ scale: 2.5 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 xl:gap-10"> {/* Mt/gap pro para separación */}
            <motion.div variants={itemVariants} className="md:flex gap-8 mb-4"> {/* Gap pro para acomodo, mb para separación */}
              <div className="md:w-1/2 space-y-3"> {/* Space pro */}
                <h3 className="footer-nav-title">Contacto</h3>
                <ul role="list" className="space-y-2"> {/* Space pro para no pegado */}
                  {navigation.support.map((item) => (
                    <motion.li key={item.name} whileHover={{ x: 8, scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Link to={item.href} className="footer-nav-link">
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 space-y-3">
                <h3 className="footer-nav-title">Consultas</h3>
                <ul role="list" className="space-y-2">
                  {navigation.solutions.map((item) => (
                    <motion.li key={item.name} whileHover={{ x: 8, scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Link to={item.href} className="footer-nav-link">
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="md:flex gap-8 mb-4"> {/* Gap pro, mb para separación */}
              <div className="md:w-full space-y-3"> {/* Full con space pro */}
                <h3 className="footer-nav-title">Empresa</h3>
                <ul role="list" className="space-y-2">
                  {navigation.company.map((item) => (
                    <motion.li key={item.name} whileHover={{ x: 8, scale: 1.05 }} transition={{ duration: 0.3 }}>
                      <Link to={item.href} className="footer-nav-link">
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants} 
          className="mt-8 border-t border-[var(--border-primary)] pt-4" // Mt/pt pro
        >
          <p className="footer-copyright-text xl:text-center">
            © 2025 JSPORT. Derechos de Autor reservados.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}

export default Footer;