import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown, ChevronUp, User, LogOut } from "lucide-react";
import StyledButton from "./StyledButton";

function UserMenu({ user, currentUser, handleLogout }) {
  return (
    <Popover className="user-menu">
      {({ open }) => (
        <>
          <Popover.Button className={`user-menu-button ${open ? "user-menu-button-active" : ""}`}>
            {user}
            {open ? <ChevronUp className="user-menu-icon" /> : <ChevronDown className="user-menu-icon" />}
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
            <Popover.Panel className="user-menu-panel">
              <div className="user-menu-content">
                <StyledButton to="/profile" className="user-menu-item">
                  <User className="user-menu-item-icon" />
                  Perfil
                </StyledButton>
                <button
                  onClick={handleLogout}
                  className="user-menu-item user-menu-logout"
                >
                  <LogOut className="user-menu-item-icon" />
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