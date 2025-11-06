import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown, ChevronUp, User, LogOut } from "lucide-react";
import StyledButton from "./StyledButton";

function UserMenu({ user, currentUser, handleLogout }) {
  return (
    <Popover className="user-menu relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
              user-menu-button flex items-center gap-2 px-4 py-2 rounded-full
              bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium
              hover:from-red-700 hover:to-pink-700 transition-all duration-300
              shadow-md hover:shadow-lg text-sm whitespace-nowrap
              ${open ? "ring-2 ring-white ring-opacity-50" : ""}
            `}
          >
            <span className="max-w-[120px] truncate">{user}</span>
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Popover.Button>

          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel
              className={`
                absolute right-0 mt-2 w-56 origin-top-right
                bg-white dark:bg-gray-800 rounded-2xl shadow-xl
                border border-gray-200 dark:border-gray-700
                overflow-hidden z-50
              `}
            >
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Conectado como</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user}
                  </p>
                </div>

                <div className="py-1">
                  <StyledButton
                    to="/profile"
                    className="user-menu-item flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Mi Perfil
                  </StyledButton>

                  <button
                    onClick={handleLogout}
                    className="user-menu-item flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export default UserMenu;