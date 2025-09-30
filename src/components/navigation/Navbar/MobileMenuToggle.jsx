import React from "react";
import { X, Menu } from "lucide-react";

function MobileMenuToggle({ isMobileMenuOpen, setMobileMenuOpen }) {
  return (
    <div className="mobile-toggle-container">
      <button
        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        className="mobile-toggle-button"
        aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMobileMenuOpen ? <X className="mobile-toggle-icon" /> : <Menu className="mobile-toggle-icon" />}
      </button>
    </div>
  );
}

export default MobileMenuToggle;