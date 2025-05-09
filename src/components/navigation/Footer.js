import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/logo_abcupon_3.jpg';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import publicidadData from '../json/publicidad.json';

const navigation = {
  solutions: [{ name: 'Preguntas frecuentes', href: '/faq' }],
  support: [{ name: 'Contactenos', href: '/contacto' }],
  company: [
    { name: 'Avisos Economicos', href: '/avisos_economicos' },
    { name: 'Directorio Comercial', href: '/directorio_comercial' },
    { name: 'Bolsa de Empleo', href: '/bolsadeempleo' },
    { name: 'Cotizador', href: '/cotizador' },
    { name: 'Blog', href: '/blog' },
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
      style={{ zoom: isMini ? '20%' : isMobile ? '50%' : '100%', backgroundColor: 'black' }}
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

        <h2
          style={{
            color: 'white',
            WebkitTextStroke: '1px white',
          }}
        >
          REDES SOCIALES ABCUPON
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-8" style={{ marginTop: '2%' }}>
          {publicidadLinks
            .filter((categoria) => categoria.nombre !== 'Facebook')
            .map((categoria) => (
              <div key={categoria.nombre} className="col-span-1 md:col-span-1">
                <h4 className="font-bold text-white text-center">{categoria.nombre}</h4>
                <div
                  className={`grid grid-cols-1 text-white ${
                    categoria.subcategorias && categoria.subcategorias.length > 1 ? 'md:grid-cols-2' : ''
                  } gap-2 mt-2`}
                >
                  {categoria.subcategorias && categoria.subcategorias.length > 0 ? (
                    categoria.subcategorias
                      .sort((a, b) => a.nombre.localeCompare(b.nombre))
                      .map((subcategoria) => (
                        <div key={subcategoria.nombre} className="text-center" style={{ color: 'white' }}>
                          <strong>{subcategoria.nombre}</strong>
                          <ul className="mt-1 space-y-1">
                            {subcategoria.grupos && subcategoria.grupos.length > 0 ? (
                              subcategoria.grupos.map((grupo) => (
                                <li key={grupo.nombre} className="text-left">
                                  <a
                                    href={grupo.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline hover:text-blue-700"
                                  >
                                    {grupo.numero} {grupo.nombre}
                                  </a>
                                </li>
                              ))
                            ) : null}
                            {subcategoria.subsubcategorias && subcategoria.subsubcategorias.length > 0 ? (
                              subcategoria.subsubcategorias.map((subsubcategoria) => (
                                <div key={subsubcategoria.nombre} className="mt-2">
                                  <strong>{subsubcategoria.nombre}</strong>
                                  {subsubcategoria.grupos && subsubcategoria.grupos.length > 0 ? (
                                    subsubcategoria.grupos.map((grupo) => (
                                      <li key={grupo.nombre} className="text-left">
                                        <a
                                          href={grupo.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 underline hover:text-blue-700"
                                        >
                                          {grupo.numero} {grupo.nombre}
                                        </a>
                                      </li>
                                    ))
                                  ) : null}
                                </div>
                              ))
                            ) : null}
                          </ul>
                        </div>
                      ))
                  ) : null}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8" style={{ width: '50%' }}>
          <h3 className="text-lg font-bold text-white">Facebook</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-white">Fan Page</h4>
              <ul className="mt-2 space-y-2 text-left">
                {sortedFanPages.map((fanPage) => (
                  <li key={fanPage.nombre}>
                    <a
                      href={fanPage.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {fanPage.numero} {fanPage.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white">Grupos Comerciales</h4>
              <ul className="mt-2 space-y-2 text-left">
                {sortedCommercialGroups.map((group) => (
                  <li key={group.nombre}>
                    <a
                      href={group.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {group.numero} {group.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            © 2025 CREATIVA LABORATORIO SITE WEB ABCupón. Derechos de Autor reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;