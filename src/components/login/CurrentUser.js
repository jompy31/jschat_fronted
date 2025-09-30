import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';

const UserList1 = (props) => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const maxAttempts = 3; // Total attempts (initial + retries)
  const attemptDelay = 1000; // Delay between attempts in ms
  const navigate = useNavigate();
  const retryCount = useRef(0);

  const fetchUserListWithRetry = async () => {
    setErrorMessage(''); // Reset error message before attempting fetch
    let attempts = 0;
    while (attempts < maxAttempts) {
      console.log('Intentando obtener lista de usuarios. Intento:', attempts + 1);
      try {
        const response = await TodoDataService.getUserList(props.token);
        console.log('Respuesta de la API:', response.data);
        const users = response.data.results || response.data;
        if (Array.isArray(users)) {
          setUserList(users);
          return; // Success, exit the loop
        } else {
          console.error('Datos de usuarios no son un array:', users);
          setErrorMessage('Formato de datos inválido.');
        }
      } catch (e) {
        console.error('Error en la API:', e.message, e.response?.data);
        setErrorMessage('Error al cargar datos: ' + (e.message || 'Desconocido'));
      }
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, attemptDelay));
      }
    }
    // If all attempts fail
    if (!userList.length) {
      console.log('Máximo de intentos alcanzado. Forzando recarga.');
      window.location.reload();
    }
  };

 useEffect(() => {
    if (props.token) {
      fetchUserListWithRetry();
    } else {
      console.log('Token no disponible aún. Esperando...');
      setErrorMessage(''); // Evitar error prematuro

      if (retryCount.current === 0) {
        retryCount.current += 1;
        setTimeout(() => {
          console.log('Reintentando recarga después de 2s...');
          window.location.reload();
        }, 2000);
      } else if (retryCount.current === 1) {
        retryCount.current += 1;
        setTimeout(() => {
          console.log('Segundo intento después de 4s...');
          window.location.reload();
        }, 4000);
      } else {
        console.log('Token no disponible después de múltiples intentos.');
      }
    }
  }, [props.token]);

  useEffect(() => {
    if (userList.length > 0 && props.user) {
      console.log('Buscando usuario con username:', props.user);
      console.log('Lista de usuarios:', userList);
      const foundUser = userList.find((user) => user.username === props.user);
      if (foundUser) {
        console.log('Usuario encontrado:', foundUser);
        setCurrentUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      } else {
        console.error('Usuario no encontrado en la lista:', props.user);
        setErrorMessage('Usuario no encontrado.');
      }
    }
  }, [userList, props.user]);

  useEffect(() => {
    if (currentUser) {
      console.log('Usuario actual cargado. Navegando a /');
      const timeout = setTimeout(() => {
        navigate('/');
      }, 1000); // Short delay to show user data before navigating
      return () => clearTimeout(timeout);
    }
  }, [currentUser, navigate]);

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.5s ease-in-out',
  };

  const containerStyle = {
    background: 'linear-gradient(135deg, #ffffff, #f5f7fa)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    borderRadius: '15px',
    width: 'min(90%, 600px)',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    animation: 'slideUp 0.5s ease-in-out',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const titleStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '25px',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const profileImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '4px solid #007bff',
    boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
    marginBottom: '25px',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  };

  const tableStyle = {
    width: '100%',
    maxWidth: '400px',
    fontFamily: "'Roboto', sans-serif",
    fontSize: '16px',
    color: '#333',
  };

  const rowStyle = {
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#007bff',
    width: '40%',
  };

  const valueStyle = {
    width: '60%',
    color: '#333',
  };

  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  return (
    <div style={modalOverlayStyle}>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        <div className="loading-logo" style={{ marginBottom: '20px' }}>
          <img src={require('../../assets/LOGO_rectangular.png')} height="60" alt="Logo" style={{ filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))' }} />
        </div>
        <h1 style={titleStyle}>Bienvenido a JSport.com</h1>
        {currentUser && currentUser.userprofile?.profile_picture && (
          <img 
            src={currentUser.userprofile.profile_picture} 
            alt="Perfil" 
            style={profileImageStyle}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        )}
        {currentUser ? (
          <div style={tableStyle}>
            <div style={rowStyle}>
              <span style={labelStyle}>Nombre:</span>
              <span style={valueStyle}>{currentUser.first_name || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Apellidos:</span>
              <span style={valueStyle}>{currentUser.last_name || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Correo:</span>
              <span style={valueStyle}>{currentUser.email || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Rol:</span>
              <span style={valueStyle}>{currentUser.userprofile?.staff_status || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Teléfono:</span>
              <span style={valueStyle}>{currentUser.userprofile?.phone_number || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "'Roboto', sans-serif", color: '#333' }}>
            {errorMessage || 'Cargando datos del usuario...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserList1;