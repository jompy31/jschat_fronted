import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/LOGO_cuadrado.png';
import "../../components/navigation/Footer.css";

const navigation = {
  support: [{ name: 'Contactenos', href: '/contacto' }],
  // solutions: [{ name: 'Preguntas frecuentes', href: '/faq' }],
  company: [
    { name: "Catálogo", href: "/catalogo" },
    { name: "Promociones", href: "/promociones" },
    { name: "Sobre Nosotros", href: "/sobre-nosotros" },
    { name: "Contacto", href: "/contacto" },
    { name: "Tienda", href: "/login" },
  ],
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61555364112133', icon: 'https://img.icons8.com/?size=100&id=118497&format=png&color=000000' },
    { name: 'Instagram', href: 'https://www.instagram.com/jsport', icon: 'https://img.icons8.com/?size=100&id=32323&format=png&color=000000' },
    { name: 'WhatsApp', href: 'https://wa.link/2xgfs3', icon: 'https://img.icons8.com/?size=100&id=16713&format=png&color=000000' },
  ],
};

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo + Redes */}
          <div className="footer-logo-section">
            <img src={logo} alt="JSPORT Logo" className="footer-logo" />
            <div className="footer-social">
              {navigation.social.map((item) => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="social-link">
                  <img src={item.icon} alt={item.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div className="footer-nav">
            <div className="nav-column">
              <h3>Contacto</h3>
              <ul>
                {navigation.support.map((item) => (
                  <li key={item.name}><Link to={item.href}>{item.name}</Link></li>
                ))}
              </ul>
            </div>
            {/* <div className="nav-column">
              <h3>Consultas</h3>
              <ul>
                {navigation.solutions.map((item) => (
                  <li key={item.name}><Link to={item.href}>{item.name}</Link></li>
                ))}
              </ul>
            </div> */}
            <div className="nav-column">
              <h3>Empresa</h3>
              <ul>
                {navigation.company.map((item) => (
                  <li key={item.name}><Link to={item.href}>{item.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2025 JSPORT. Derechos de Autor reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;