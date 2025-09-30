import React, { useState, useEffect } from "react";
import SideNav, { Toggle, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { useNavigate } from "react-router-dom";
import { 
  FiUsers, FiUserCheck, FiEdit, FiCalendar, FiBookOpen, 
  FiPackage, FiDollarSign, FiStar, FiClock, FiSettings, 
  FiBox, FiList, FiCheckSquare 
} from "react-icons/fi";
import { VisibilityOutlined as VisibilityOutlinedIcon, VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import "./sidebar.css";

function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const fetchCurrentUserData = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setCurrentUser(JSON.parse(currentUser));
    }
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  const resetTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => {
      setIsSidebarExpanded(false);
    }, 5000);
    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSidebarExpanded]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
    resetTimer();
  };

  const roleBasedMenus = {
    administrator: [
      { name: 'Usuarios', href: '/users', icon: FiUsers, description: 'Gestionar usuarios del sistema' },
      { name: 'Clientes', href: '/customers', icon: FiUserCheck, description: 'Gestionar clientes y proveedores' },
      { name: 'Productos', href: '/products', icon: FiBox, description: 'Gestionar productos y tipos' },
      { name: 'Pedidos', href: '/orders', icon: FiPackage, description: 'Gestionar todos los pedidos' },
       { name: 'Colas de Producción', href: '/production-queues', icon: FiClock, description: 'Planificar producción' },
      { name: 'Promociones', href: '/promotions', icon: FiDollarSign, description: 'Crear y editar promociones' },
      { name: 'Puntos de Clientes', href: '/customer-points', icon: FiStar, description: 'Gestionar puntos de clientes' },
      { name: 'Archivos', href: '/files', icon: FiEdit, description: 'Editar archivos compartidos' },
      { name: 'Calendario', href: '/calendar', icon: FiCalendar, description: 'Ver y editar calendario' },
      { name: 'Blog', href: '/blog', icon: FiBookOpen, description: 'Leer y gestionar publicaciones' },
      { name: 'Configuración', href: '/settings', icon: FiSettings, description: 'Configuraciones del sistema' },
    ],
    sales: [
      { name: 'Clientes', href: '/customers', icon: FiUserCheck, description: 'Gestionar clientes y proveedores' },
      
      { name: 'Productos', href: '/products', icon: FiBox, description: 'Gestionar productos y tipos' },
      { name: 'Pedidos', href: '/orders', icon: FiPackage, description: 'Gestionar todos los pedidos' },
      { name: 'Promociones', href: '/promotions', icon: FiDollarSign, description: 'Crear y editar promociones' },
      { name: 'Puntos de Clientes', href: '/customer-points', icon: FiStar, description: 'Gestionar puntos de clientes' },
      { name: 'Colas de Producción', href: '/production-queues', icon: FiClock, description: 'Planificar producción' },
      { name: 'Archivos', href: '/files', icon: FiEdit, description: 'Editar archivos compartidos' },
      { name: 'Calendario', href: '/calendar', icon: FiCalendar, description: 'Ver y editar calendario' },
      { name: 'Blog', href: '/blog', icon: FiBookOpen, description: 'Leer publicaciones' },
    ],
    design: [
       { name: 'Productos', href: '/products', icon: FiBox, description: 'Ver productos y tipos' },
      { name: 'Pedidos de Diseño', href: '/orders', icon: FiPackage, description: 'Gestionar pedidos en diseño' },
     
      { name: 'Colas de Producción', href: '/production-queues', icon: FiClock, description: 'Ver colas de producción' },
      { name: 'Archivos', href: '/files', icon: FiEdit, description: 'Editar archivos de diseño' },
      { name: 'Calendario', href: '/calendar', icon: FiCalendar, description: 'Ver calendario' },
      { name: 'Blog', href: '/blog', icon: FiBookOpen, description: 'Leer publicaciones' },
    ],
    customer: [
      { name: 'Mis Pedidos', href: '/orders', icon: FiPackage, description: 'Ver tus pedidos' },
      { name: 'Mi Perfil', href: '/profile', icon: FiUserCheck, description: 'Editar tu perfil' },
      { name: 'Puntos', href: '/customer-points', icon: FiStar, description: 'Ver tus puntos' },
      { name: 'Calendario', href: '/calendar', icon: FiCalendar, description: 'Ver calendario' },
      { name: 'Blog', href: '/blog', icon: FiBookOpen, description: 'Leer publicaciones' },
    ],
  };

  if (!currentUser || !currentUser.userprofile.staff_status) {
    return null;
  }

  const menus = roleBasedMenus[currentUser.userprofile.staff_status] || [];

  return (
    <div className={`sidebar ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
      <SideNav
        style={{ background: isSidebarExpanded ? 'white' : 'transparent', color: 'blue' }}
        expanded={isSidebarExpanded}
        onSelect={(selected) => navigate(selected)}
      >
        <Toggle onClick={toggleSidebar}>
          {isSidebarExpanded ? (
            <VisibilityOutlinedIcon style={{ color: 'blue' }} />
          ) : (
            <VisibilityOffIcon style={{ color: 'blue' }} />
          )}
        </Toggle>
        {isSidebarExpanded && (
          <SideNav.Nav defaultSelected="/dashboard">
            {menus.map((menu, index) => (
              <NavItem key={`menu-${index}`} eventKey={menu.href} style={{ marginBottom: '20px' }}>
                <NavIcon>
                  <menu.icon size={22} style={{ color: 'blue' }} />
                </NavIcon>
                <NavText className={isSidebarExpanded ? "" : "collapsed"} style={{ color: 'black' }}>
                  {menu.name}
                </NavText>
              </NavItem>
            ))}
          </SideNav.Nav>
        )}
      </SideNav>
    </div>
  );
}

export default Sidebar;