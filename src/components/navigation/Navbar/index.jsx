import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash";
import { setAuthentication } from "../../../redux/actions/authActions";
import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenuToggle from "./MobileMenuToggle";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import "./Navbar.css";

const navItems = [
  { name: "Catálogo", description: "Explora nuestra colección de productos deportivos", href: "/catalogo", icon: "Package" },
  { name: "Promociones", description: "Descubre nuestras ofertas exclusivas", href: "/promociones", icon: "Star" },
  { name: "Sobre Nosotros", description: "Conoce más sobre J SPORT", href: "/sobre_nosotros", icon: "Info" },
  { name: "Blog", description: "Accede a nuestro blog", href: "/blog", icon: "ShoppingCart" },
  { name: "Contacto", description: "Ponte en contacto con nosotros", href: "/contacto", icon: "Mail" },
 
];

function Navbar({ logout, setIsSidebar }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const token = useSelector((state) => state.authentication.token);
  const user = useSelector((state) => state.authentication.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    const storedToken = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("user");
    if (storedToken && storedUserName) {
      dispatch(setAuthentication(storedToken, storedUserName));
    }
  }, [dispatch]);

  const handleScroll = useCallback(
    debounce(() => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        if (document.documentElement.scrollTop > 50) {
          navbar.classList.add("navbar-scrolled");
        } else {
          navbar.classList.remove("navbar-scrolled");
        }
      }
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/login");
  };

  return (
    <nav id="navbar" className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Logo />
        </div>
        <div className="navbar-menu-desktop">
          <DesktopMenu navItems={navItems} user={user} currentUser={currentUser} handleLogout={handleLogout} />
        </div>
        <div className="navbar-menu-toggle">
          <MobileMenuToggle isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        </div>
        <MobileMenu
          isMobileMenuOpen={isMobileMenuOpen}
          navItems={navItems}
          user={user}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      </div>
    </nav>
  );
}

export default Navbar;