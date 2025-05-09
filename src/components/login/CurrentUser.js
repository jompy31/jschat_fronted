import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';

const UserList1 = (props) => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserList = () => {
    if (props.token) {
      TodoDataService.getUserList(props.token)
        .then((response) => {
          setUserList(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getUserList();
  }, [props.token]);

  useEffect(() => {
    if (userList.length > 0 && props.user) {
      const foundUser = userList.find((user) => user.email === props.user);
      setCurrentUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    }
  }, [userList, props.user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
          <img src={require('../../assets/categorias/25.webp')} height="60" alt="Logo" style={{ filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))' }} />
        </div>
        <h1 style={titleStyle}>Bienvenido a ABCupon.com</h1>
        {currentUser && currentUser.profile_picture && (
          <img 
            src={currentUser.profile_picture} 
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
              <span style={valueStyle}>{currentUser.staff_status || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Teléfono:</span>
              <span style={valueStyle}>{currentUser.phone_number || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Compañía:</span>
              <span style={valueStyle}>{currentUser.company || 'N/A'}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Nacimiento:</span>
              <span style={valueStyle}>{currentUser.date_of_birth || 'N/A'}</span>
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "'Roboto', sans-serif", color: '#333' }}>Usuario no encontrado</p>
        )}
      </div>
    </div>
  );
};

export default UserList1;