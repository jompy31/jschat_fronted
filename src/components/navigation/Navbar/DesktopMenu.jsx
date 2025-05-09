import React from "react";
import { NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
import StyledButton from "./StyledButton";

function DesktopMenu({ solutions, user, currentUser, handleLogout }) {
  return (
    <div className="flex items-center">
     {solutions.map((item) => (
            <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive
                  ? "bg-red-500 text-white border-[3px] border-black"
                  : "bg-white text-black border-[3px] border-red-500"
              } uppercase rounded-t-md hover:bg-red-500 hover:text-white hover:border-black`
            }
          >
            {item.name}
          </NavLink>
          
          ))}
      {user ? (
        <UserMenu user={user} currentUser={currentUser} handleLogout={handleLogout} />
      ) : (
        <StyledButton to="/login" className="bg-red-500 text-white hover:bg-gray-900">
          Inicio de sesión
        </StyledButton>
      )}
    </div>
  );
}

export default DesktopMenu;