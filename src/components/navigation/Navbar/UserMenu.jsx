import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown, ChevronUp, User, Folder, LogOut } from "lucide-react";
import StyledButton from "./StyledButton";

const roleLinks = {
  user: [{ to: "/files", label: "Archivos", icon: Folder }],
  administrator: [
    { to: "/files", label: "Archivos", icon: Folder },
    { to: "/catalogo", label: "Catalogo", icon: Folder },
    { to: "/user", label: "Usuarios", icon: Folder },
    // { to: "/rh", label: "RH", icon: Folder },
    // { to: "/turismo", label: "Turismo", icon: Folder },
  ],
  sales: [
    { to: "/catalogo", label: "Catalogo", icon: Folder },
    { to: "/customer", label: "Clientes", icon: Folder },
    { to: "/files", label: "Archivos", icon: Folder },
  ],
  human_resources: [{ to: "/rh", label: "RH", icon: Folder }],
  owner: [{ to: "/turismo", label: "Turismo", icon: Folder }],
};

function UserMenu({ user, currentUser, handleLogout }) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-transform duration-300 transform hover:-translate-y-1 hover:bg-green-500 hover:text-white ${
              open ? "text-black border-red-500" : "text-black border-red-500"
            } focus:outline-none`}
          >
            {user}
            {open ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
          </Popover.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                <StyledButton to="/profile" className="w-[15vh] bg-white text-black border-black hover:bg-green-500 hover:text-white">
                  <User className="h-5 w-5 text-red-500 mr-2" />
                  Perfil
                </StyledButton>
                {currentUser &&
                  roleLinks[currentUser.staff_status]?.map((link) => (
                    <StyledButton
                      key={link.to}
                      to={link.to}
                      className="w-[15vh] bg-white text-black border-black hover:bg-green-500 hover:text-white"
                    >
                      <link.icon className="h-5 w-5 text-red-500 mr-2" />
                      {link.label}
                    </StyledButton>
                  ))}
                <StyledButton to="/calendario" className="w-[15vh] bg-white text-black border-black hover:bg-green-500 hover:text-white">
                  <Folder className="h-5 w-5 text-red-500 mr-0" />
                  Calendario
                </StyledButton>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 text-red-500 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export default UserMenu;