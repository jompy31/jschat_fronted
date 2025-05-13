import React, { useState, useEffect } from "react";
import SideNav, { Toggle, NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiUserCheck, FiEdit, FiCalendar, FiBookOpen, FiPhone, FiMail, FiMonitor, FiPackage, FiSettings, FiBell, FiBriefcase } from "react-icons/fi";
import { VisibilityOutlined as VisibilityOutlinedIcon, VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import "./sidebar.css";

function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const fetchCurrentUserData = () => {
    const currentUser = localStorage.getItem('currentUser');
    setCurrentUser(JSON.parse(currentUser));
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  const resetTimer = () => {
    // Reinicia el temporizador
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Establece un nuevo temporizador después de reiniciar
    const newTimeoutId = setTimeout(() => {
      setIsSidebarExpanded(false);
    }, 5000);

    // Actualiza el estado del nuevo temporizador
    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    if (currentUser && currentUser.staff_status === 'administrator') {
      setIsSidebarVisible(true);
      // resetTimer(); // Llama a la función para iniciar el temporizador
    } else {
      setIsSidebarVisible(false);
    }

    // Limpia el temporizador al desmontar el componente
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentUser, timeoutId]);
  useEffect(() => {
    resetTimer();
  }, [isSidebarExpanded]);
  
  const solutions = [
    {
      name: 'Equipo',
      description: 'Administrar 3 tipos de usuarios',
      href: '/user',
      icon: FiUsers,
    },
    {
      name: 'Clientes',
      description: 'Informacion de clientes',
      href: '/customer',
      icon: FiUserCheck,
    },
    {
      name: 'Archivos',
      description: 'Editar los archivos compartidos',
      href: '/files',
      icon: FiEdit,
    },
    {
      name: 'Calendario',
      description: 'Editar Calendario',
      href: '/calendario',
      icon: FiCalendar,
    },
    {
      name: 'Blog',
      description: 'Puedes leer las ultimas publicaciones',
      href: '/blog',
      icon: FiBookOpen,
    },
    {
      name: 'Empleos',
      description: 'Administrar empleos',
      href: '/empleos',
      icon: FiBriefcase,
    },
    // {
    //   name: 'Hoteles',
    //   description: 'Administrar hoteles',
    //   href: '/manage_tourism',
    //   icon: FiBriefcase,
    // },
    {
      name: 'Modificar archivos',
      description: 'Modificar archivos multimedia',
      href: '/files_frontend',
      icon: FiSettings,
    },
  ];

  

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
     resetTimer();
  };

  if (!isSidebarVisible) {
    return null;
  }

  return (
    <div className={`sidebar ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`} style={{ background: isSidebarExpanded ? 'white' : 'transparent', color: 'blue', float: 'right' }}>
      <div style={{ flex: 1 }}></div>
      <SideNav
        style={{ background: isSidebarExpanded ? 'white' : 'transparent', color: 'blue' }}
        expanded={isSidebarExpanded} // Cambio aquí: usar directamente el valor de isSidebarExpanded
        onToggle={toggleSidebar} // Eliminar esta línea, ya no es necesaria
        onSelect={selected => {
          // console.log(selected);
          navigate(selected);
        }}
      >
        <Toggle className="sidebar-toggle">
          {isSidebarExpanded ? (
            <VisibilityOutlinedIcon style={{ color: 'blue' }} />
          ) : (
            <VisibilityOffIcon style={{ color: 'blue' }} />
          )}
        </Toggle>
        {isSidebarExpanded && (
          <SideNav.Nav defaultSelected='home'>
            {solutions.map((solution, index) => (
              <NavItem key={`solution-${index}`} eventKey={solution.href} style={{ marginBottom: '20px' }}> 
                <NavIcon>
                  {isSidebarExpanded && (
                    <solution.icon size={22} style={{ color: 'blue' }} />
                  )}
                </NavIcon>
                <NavText className={isSidebarExpanded ? "" : "collapsed"} style={{ color: 'black' }}>
                  {solution.name}
                </NavText>
              </NavItem>
            ))}
            <NavItem>
              <NavText style={{ borderTop: '1px solid white' }}></NavText>
            </NavItem>
          
          </SideNav.Nav>
        )}
      </SideNav>
    </div>
  );
}

export default Sidebar;
