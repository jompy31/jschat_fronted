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

const solutions = [
  { name: "Catálogo", description: "Visualiza el Directorio Central de 24 categorias", href: "/catalogo", icon: "Package" },
  { name: "Comercios_Afiliados", description: "Visualiza el Directorio Central de 24 categorias", href: "/comercios_afiliados", icon: "Package" },
  { name: "20_Publiembudo", description: "Busca productos en nuestra tienda virtual.", href: "/publiembudo", icon: "Monitor" },
  { name: "16_Avisos_Economicos", description: "Busca productos en avisos economicos", href: "/avisos_economicos", icon: "Bell" },
  { name: "02_Bolsa_de_Empleo", description: "Publica su empleo o perfil en la bolsa de empleo", href: "/bolsadeempleo", icon: "Bell" },
  { name: "Cotizador", description: "Crea tu propio paquete de publicidad", href: "/cotizador", icon: "Package" },
  { name: "Blog", description: "Lee nuestras últimas publicaciones en el blog", href: "/blog", icon: "BookOpen" },
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
          navbar.classList.add("shadow-md", "bg-white");
        } else {
          navbar.classList.remove("shadow-md", "bg-white");
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
    <nav id="navbar" className="fixed inset-x-0 top-0 z-50 h-[15vh] transition-all duration-300">
  <div className="flex h-full  items-center px-4 sm:px-6 lg:px-8 justify-between">
    {/* Logo alineado a la izquierda */}
    <div >
      <Logo />
    </div>

    {/* Menús centrados */}
    <div className="hidden lg:block">
      <DesktopMenu solutions={solutions} user={user} currentUser={currentUser} handleLogout={handleLogout} />
    </div>

    {/* Botón de menú móvil a la derecha */}
    <div >
      <MobileMenuToggle isMobileMenuOpen={isMobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
    </div>

    {/* Menú móvil desplegable (oculto por defecto en desktop) */}
    <MobileMenu
      isMobileMenuOpen={isMobileMenuOpen}
      solutions={solutions}
      user={user}
      currentUser={currentUser}
      handleLogout={handleLogout}
    />
  </div>
</nav>

  );
}

export default Navbar;