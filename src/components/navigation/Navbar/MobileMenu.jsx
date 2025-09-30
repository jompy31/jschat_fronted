import React from "react";
import { NavLink } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { User, LogOut } from "lucide-react";
import StyledButton from "./StyledButton";

function MobileMenu({ isMobileMenuOpen, navItems, user, currentUser, handleLogout }) {
  return (
    <Transition
      show={isMobileMenuOpen}
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
          >
            <div className="mobile-menu-item-content">
              <p className="mobile-menu-item-title">{item.name}</p>
              <p className="mobile-menu-item-description">{item.description}</p>
            </div>
          </NavLink>
        ))}
        {user ? (
          <div className="mobile-menu-user">
            <StyledButton to="/profile" className="mobile-menu-button">
              <User className="mobile-menu-icon" />
              Perfil
            </StyledButton>
            <button
              onClick={handleLogout}
              className="mobile-menu-button mobile-menu-logout"
            >
              <LogOut className="mobile-menu-icon" />
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <StyledButton to="/login" className="mobile-menu-login">
            Iniciar Sesión
          </StyledButton>
        )}
      </div>
    </Transition>
  );
}

export default MobileMenu;