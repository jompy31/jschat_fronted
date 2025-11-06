import React from "react";
import { createPortal } from "react-dom"; // 👈 Nuevo import para portal
import { NavLink } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { User, LogOut } from "lucide-react";
import StyledButton from "./StyledButton";

function MobileMenu({ isMobileMenuOpen, setMobileMenuOpen, navItems, user, currentUser, handleLogout }) {
  const closeMenu = () => setMobileMenuOpen(false);

  // Contenido del menú (Transition + backdrop)
  const menuContent = (
    <>
      {/* Backdrop: Fondo semi-transparente que cierra al click fuera */}
      <Transition
        show={isMobileMenuOpen}
        appear={true} // 👈 Agregado para animar en primer render (mejora mobile)
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="mobile-menu-backdrop"
          onClick={closeMenu}
        />
      </Transition>

      {/* Menú principal */}
      <Transition
        show={isMobileMenuOpen}
        appear={true} // 👈 Agregado
        enter="transition ease-out duration-300"
        enterFrom="transform -translate-x-full"
        enterTo="transform translate-x-0"
        leave="transition ease-in duration-300"
        leaveFrom="transform translate-x-0"
        leaveTo="transform -translate-x-full"
        className="mobile-menu"
      >
        <div className="mobile-menu-content">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="mobile-menu-item"
              onClick={closeMenu} // Cierra al seleccionar
            >
              <div className="mobile-menu-item-content">
                <p className="mobile-menu-item-title">{item.name}</p>
                <p className="mobile-menu-item-description">{item.description}</p>
              </div>
            </NavLink>
          ))}
          {user ? (
            <div className="mobile-menu-user">
              <StyledButton to="/profile" className="mobile-menu-button" onClick={closeMenu}>
                <User className="mobile-menu-icon" />
                Perfil
              </StyledButton>
              <button
                onClick={() => { handleLogout(); closeMenu(); }}
                className="mobile-menu-button mobile-menu-logout"
              >
                <LogOut className="mobile-menu-icon" />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <StyledButton to="/login" className="mobile-menu-login" onClick={closeMenu}>
              Iniciar Sesión
            </StyledButton>
          )}
        </div>
      </Transition>
    </>
  );

  // Renderizar en portal solo si abierto (optimización)
  return isMobileMenuOpen ? createPortal(menuContent, document.body) : null;
}

export default MobileMenu;