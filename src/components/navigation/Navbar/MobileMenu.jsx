import React from "react";
import { NavLink } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { User, Folder, LogOut } from "lucide-react";
import StyledButton from "./StyledButton";

const roleLinks = {
  user: [{ to: "/files", label: "Archivos", icon: Folder }],
  administrator: [
    { to: "/files", label: "Archivos", icon: Folder },
    { to: "/catalogo", label: "Catalogo", icon: Folder },
    { to: "/user", label: "Usuarios", icon: Folder },
    { to: "/rh", label: "RH", icon: Folder },
    { to: "/turismo", label: "Turismo", icon: Folder },
  ],
  sales: [
    { to: "/catalogo", label: "Catalogo", icon: Folder },
    { to: "/customer", label: "Clientes", icon: Folder },
    { to: "/files", label: "Archivos", icon: Folder },
  ],
  human_resources: [{ to: "/rh", label: "RH", icon: Folder }],
  owner: [{ to: "/turismo", label: "Turismo", icon: Folder }],
};

function MobileMenu({ isMobileMenuOpen, solutions, user, currentUser, handleLogout }) {
  return (
    <Transition
      show={isMobileMenuOpen}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
      className="lg:hidden"
    >
      <div className="absolute top-16 inset-x-0 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-lg p-7">
        <div className="grid gap-4">
          {solutions.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="flex items-center rounded-md p-3 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              {item.icon && <item.icon className="h-6 w-6 text-blue-500 mr-3" />}
              <div>
                <p>{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </NavLink>
          ))}
          {user ? (
            <div className="space-y-2">
              <StyledButton to="/profile" className="w-[15vh] bg-white text-black border-black hover:bg-green-500 hover:text-white">
                <User className="h-5 w-5 text-blue-500 mr-2" />
                Perfil
              </StyledButton>
              {currentUser &&
                roleLinks[currentUser.staff_status]?.map((link) => (
                  <StyledButton
                    key={link.to}
                    to={link.to}
                    className="w-[15vh] bg-white text-black border-black hover:bg-green-500 hover:text-white"
                  >
                    <link.icon className="h-5 w-5 text-blue-500 mr-2" />
                    {link.label}
                  </StyledButton>
                ))}
              <StyledButton to="/calendar" className="w-[15vh] bg-white text-black border-black hover:bg-green-500 hover:text-white">
                <Folder className="h-5 w-5 text-blue-500 mr-2" />
                Calendario
              </StyledButton>
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-md p-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 text-blue-500 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <StyledButton to="/login" className="bg-red-500 text-white hover:bg-gray-900">
              Inicio de sesión
            </StyledButton>
          )}
        </div>
      </div>
    </Transition>
  );
}

export default MobileMenu;