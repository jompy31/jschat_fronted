import React from "react";
import { NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import StyledButton from "./StyledButton";

function DesktopMenu({ navItems, user, currentUser, handleLogout }) {
  return (
    <div className="desktop-menu">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `desktop-menu-item ${isActive ? "desktop-menu-item-active" : ""}`
          }
        >
          {item.name}
        </NavLink>
      ))}
      {user ? (
        <UserMenu user={user} currentUser={currentUser} handleLogout={handleLogout} />
      ) : (
        <StyledButton to="/login" className="desktop-menu-login">
          Iniciar Sesión
        </StyledButton>
      )}
    </div>
  );
}

export default DesktopMenu;