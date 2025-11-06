// frontend_github/jschat_fronted/src/components/navigation/sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiUsers, FiUserCheck, FiEdit, FiCalendar, FiBookOpen,
  FiPackage, FiDollarSign, FiStar, FiClock, FiSettings,
  FiBox, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import "./sidebar.css";

const Sidebar = ({ isSidebar, onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const roleBasedMenus = {
    administrator: [
      { name: "Usuarios", href: "/users", icon: FiUsers },
      { name: "Clientes", href: "/customers", icon: FiUserCheck },
      { name: "Productos", href: "/products", icon: FiBox },
      { name: "Pedidos", href: "/orders", icon: FiPackage },
      { name: "Promociones", href: "/promotions", icon: FiDollarSign },
      { name: "Puntos", href: "/customer-points", icon: FiStar },
      { name: "Producción", href: "/production-queues", icon: FiClock },
      // { name: "Archivos", href: "/files", icon: FiEdit },
      // { name: "Calendario", href: "/calendar", icon: FiCalendar },
      // { name: "Blog", href: "/blog", icon: FiBookOpen },
      // { name: "Config", href: "/settings", icon: FiSettings },
    ],
    sales: [
      { name: "Clientes", href: "/customers", icon: FiUserCheck },
      { name: "Productos", href: "/products", icon: FiBox },
      { name: "Pedidos", href: "/orders", icon: FiPackage },
      { name: "Promociones", href: "/promotions", icon: FiDollarSign },
      { name: "Puntos", href: "/customer-points", icon: FiStar },
      { name: "Producción", href: "/production-queues", icon: FiClock },
      // { name: "Archivos", href: "/files", icon: FiEdit },
      // { name: "Calendario", href: "/calendar", icon: FiCalendar },
      // { name: "Blog", href: "/blog", icon: FiBookOpen },
    ],
    design: [
      { name: "Productos", href: "/products", icon: FiBox },
      { name: "Diseños", href: "/orders", icon: FiPackage },
      { name: "Producción", href: "/production-queues", icon: FiClock },
      // { name: "Archivos", href: "/files", icon: FiEdit },
      // { name: "Calendario", href: "/calendar", icon: FiCalendar },
      // { name: "Blog", href: "/blog", icon: FiBookOpen },
    ],
    customer: [
      { name: "Mis Pedidos", href: "/orders", icon: FiPackage },
      { name: "Perfil", href: "/profile", icon: FiUserCheck },
      { name: "Puntos", href: "/customer-points", icon: FiStar },
      // { name: "Calendario", href: "/calendar", icon: FiCalendar },
      // { name: "Blog", href: "/blog", icon: FiBookOpen },
    ],
  };

  if (!currentUser?.userprofile?.staff_status) return null;

  const menus = roleBasedMenus[currentUser.userprofile.staff_status] || [];

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : "collapsed"} ${isSidebar ? "visible" : ""}`}>
      <div className="sidebar-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <FiChevronRight /> : <FiChevronLeft />}
      </div>

      <nav className="sidebar-nav">
        {menus.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
        key={item.href}
        onClick={() => {
          navigate(item.href);
          if (window.innerWidth < 1024 && onClose) {
            onClose();
          }
        }}
        className={`sidebar-item ${isActive ? "active" : ""}`}
      >
              <item.icon className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">{item.name}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;