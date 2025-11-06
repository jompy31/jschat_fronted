import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // ← AÑADIDO
import TodoDataService from '../../services/todos';

const UserList1 = () => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const maxAttempts = 3;
  const attemptDelay = 1000;
  const navigate = useNavigate();
  const retryCount = useRef(0);

  // ← OBTENER token y user desde Redux
  const { token, user: loggedUsername } = useSelector((state) => state.authentication);

  const fetchUserListWithRetry = async () => {
    if (!token) {
      setErrorMessage('No estás autenticado. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setErrorMessage('');
    let attempts = 0;

    while (attempts < maxAttempts) {
      console.log('Intentando obtener lista de usuarios. Intento:', attempts + 1);
      try {
        const response = await TodoDataService.getUserList(token);
        const users = response.data.results || response.data;

        if (Array.isArray(users)) {
          setUserList(users);
          return;
        }
      } catch (e) {
        console.error('Error:', e.response?.data || e.message);
        setErrorMessage('Error al cargar datos. Reintentando...');
      }
      attempts++;
      if (attempts < maxAttempts) await new Promise(r => setTimeout(r, attemptDelay));
    }

    setErrorMessage('No se pudo cargar la información. Volviendo al login...');
    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 3000);
  };

  useEffect(() => {
    if (token && loggedUsername) {
      fetchUserListWithRetry();
    } else {
      console.log('Token o usuario no disponibles. Redirigiendo...');
      setErrorMessage('Sesión no válida. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [token, loggedUsername]);

  useEffect(() => {
    if (userList.length > 0 && loggedUsername) {
      const foundUser = userList.find(u => u.username === loggedUsername);
      if (foundUser) {
        setCurrentUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      } else {
        setErrorMessage('Usuario no encontrado en la lista.');
      }
    }
  }, [userList, loggedUsername]);

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => navigate('/'), 1500);
    }
  }, [currentUser]);

  // Estilos igual que antes...
  const modalOverlayStyle = { /* ... mismo que tenías ... */ };
  const containerStyle = { /* ... */ };
  // ... (mantén todos tus estilos)

  return (
    <div style={modalOverlayStyle}>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } ...`}</style>
      <div style={containerStyle}>
        <div className="loading-logo" style={{ marginBottom: '20px' }}>
          <img src={require('../../assets/LOGO_rectangular.png')} height="60" alt="Logo" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a' }}>
          Bienvenido a JSport.com
        </h1>

        {currentUser ? (
          <>
            {currentUser.userprofile?.profile_picture && (
              <img src={currentUser.userprofile.profile_picture} alt="Perfil" style={{
                width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #007bff',
                boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)', marginBottom: '25px'
              }} />
            )}
            <div style={{ width: '100%', maxWidth: '400px', fontFamily: "'Roboto', sans-serif" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: '600', color: '#007bff' }}>Nombre:</span>
                <span>{currentUser.first_name || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: '600', color: '#007bff' }}>Apellidos:</span>
                <span>{currentUser.last_name || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: '600', color: '#007bff' }}>Correo:</span>
                <span>{currentUser.email || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: '600', color: '#007bff' }}>Rol:</span>
                <span>{currentUser.userprofile?.staff_status || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: '600', color: '#007bff' }}>Teléfono:</span>
                <span>{currentUser.userprofile?.phone_number || 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: '#333', fontSize: '18px' }}>
            {errorMessage || 'Cargando tus datos...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserList1;