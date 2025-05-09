import React from "react";
import { X, Menu } from "lucide-react";

function MobileMenuToggle({ isMobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="lg:hidden">
      <button
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  );
}

export default MobileMenuToggle;