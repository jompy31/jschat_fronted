import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import logo from '../../assets/logo_abcupon_3.jpg'; // Asegúrate de que esta ruta sea correcta
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import publicidadData from './publicidad.json';

const navigation = {
  solutions: [
    { name: 'Programe una reunion con nosotros', href: '/calendar' },
  ],
  support: [{ name: 'Contacto', href: '/contacto' }],
  company: [
    { name: 'Asociados', href: '/technology' },
    { name: 'Servicios', href: '/products' },
    { name: 'Sobre Nosotros', href: '/services' },
    { name: 'Clasificados', href: '/news' },
    { name: 'Blog', href: '/blog' },
  ],
  social: [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            d="M20.25 0H3.75C1.677 0 0 1.677 0 3.75v16.5C0 22.323 1.677 24 3.75 24h16.5c2.073 0 3.75-1.677 3.75-3.75V3.75C24 1.677 22.323 0 20.25 0zM7.688 19.125h-3.75V9.375h3.75v9.75zm-1.875-11.625h-.025c-1.983 0-3.326-1.359-3.326-3.047 0-1.766 1.414-3.031 3.575-3.031 2.16 0 3.327 1.266 3.35 3.031 0 1.688-1.342 3.047-3.575 3.047zM20.25 19.125h-3.75v-5.109c0-1.219-.438-2.047-1.532-2.047-.828 0-1.313.563-1.531 1.109-.078.188-.1.453-.1.719v5.328h-3.75V9.375h3.525v1.531h.05c.491-.922 1.688-1.891 3.476-1.891 3.725 0 4.405 2.45 4.405 5.625v6.609z"
          />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/ComunidadABCupon',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.76 6.53L13.5 9.5c-.66 0-.94.27-1.08.39-.14.12-.27.31-.31.53v1.45h2.66l-.36 2.64H12.5v6H9.5v-6H7V11h2.5V9.5C9.5 7.01 11.3 5 13.79 5c.78 0 1.46.07 1.64.1v2.43z"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/abcupon_cr/',
      icon: (props) => <FaInstagram {...props} />,
    },
    {
      name: 'WhatsApp Business',
      href: 'https://api.whatsapp.com/send?phone=+50687886767&text=Hola%20me%20gustaria%20saber%20mas%20informacion',
      icon: (props) => <FaWhatsapp {...props} />,
    },
  ],
};

function Footer() {
  const [publicidadLinks, setPublicidadLinks] = useState([]);

  useEffect(() => {
    // Cargar los links del archivo publicidad.json
    setPublicidadLinks(publicidadData.categorias);
  }, []);

  return (
    <footer aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Pie de página
      </h2>
      <div className="mx-auto max-w-full py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {/* Logo en el footer */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo ABCupon" className="h-16" />
        </div>

        {/* Fila para Contacto, Consultas y Empresa */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Contacto</h3>
            <ul role="list" className="mt-4 space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Consultas</h3>
            <ul role="list" className="mt-4 space-y-2">
              {navigation.solutions.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900">Empresa</h3>
            <ul role="list" className="mt-4 space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fila para las categorías */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4 mb-8">
          {publicidadLinks.map((categoria) => (
            <div key={categoria.nombre} className="col-span-1 md:col-span-1">
              <h4 className="font-bold text-gray-900 text-center">{categoria.nombre}</h4>
              <ul className="mt-2 space-y-1">
                {categoria.subcategorias.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((subcategoria) => (
                  <li key={subcategoria.nombre} className="text-center" style={{color:"black"}}>
                    <strong>{subcategoria.nombre}</strong>
                    <ul className="mt-1 space-y-1">
                      {subcategoria.grupos
                        .sort((a, b) => b.nombre.length - a.nombre.length) // Ordenar de mayor a menor longitud
                        .map((grupo) => (
                          <li key={grupo.nombre} className="text-left"> {/* Alinear a la izquierda */}
                            <a
                              href={grupo.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {grupo.nombre}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ABCupon, Inc. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

const mapStateToProps = (state) => {
  return {
    productos: state.productos,
  };
};

export default connect(mapStateToProps)(Footer);
