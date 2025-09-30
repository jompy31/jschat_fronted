import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/LOGO_cuadrado.png';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import publicidadData from '../json/publicidad.json';

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

  return (
    <footer
      aria-labelledby="footer-heading"
      style={{ zoom: isMini ? '20%' : isMobile ? '50%' : '100%', backgroundColor: '#0A2463' }}
    >
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>
      <div className="mx-auto max-w-full py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img src={logo} width={250} height={250} className="" alt="Logo" />
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-white hover:text-[#0BFC28]">
                  <item.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:flex">
              <div className="md:w-1/2 text-justify">
                <h3 className="text-lg font-bold text-white text-justify">Contacto</h3>
                <ul role="list" className="mt-2 space-y-2">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-white hover:text-[#0BFC28] text-justify"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div className="md:w-1/2 text-justify">
                <h3 className="text-lg font-bold text-white">Consultas</h3>
                <ul role="list" className="mt-2 space-y-2">
                  {navigation.solutions.map((item) => (
                    <li key={item.name} className="text-justify">
                      <Link
                        to={item.href}
                        className="text-base text-white hover:text-[#0BFC28]"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:flex">
              <br />
              <div className="md:w-1/2">
                <h3 className="text-lg font-bold text-white text-justify">Empresa</h3>
                <ul role="list" className="mt-2 space-y-2 text-justify">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-base text-white hover:text-[#0BFC28]"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            © 2025 JSPORT. Derechos de Autor reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;