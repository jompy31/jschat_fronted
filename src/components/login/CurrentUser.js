// src/components/login/CurrentUser.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';

const CurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setErrorMessage('No hay sesión. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        // AHORA SÍ: Usa /me/ → siempre el usuario correcto
        const response = await TodoDataService.getUserDetails('me', token);
        const userData = response.data;

        setCurrentUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));

        console.log('CurrentUser desde /me/:', userData);
        console.log('Rol:', userData.userprofile?.staff_status);
        console.log('Foto:', userData.userprofile?.profile_picture);
        console.log('Teléfono:', userData.userprofile?.phone_number);

      } catch (error) {
        console.error('Error en /me/:', error);
        const msg = error.response?.data?.detail || 'No se pudo cargar el perfil';
        setErrorMessage(msg);

        if (error.response?.status === 401) {
          localStorage.clear();
          setTimeout(() => navigate('/login'), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token, navigate]);

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2800);
    }
  }, [currentUser, navigate]);

  // === ESTILOS (mismo que antes, solo copiar) ===
  const styles = {
    overlay: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #3b82f6, #10b981)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(12px)' },
    card: { background: 'white', borderRadius: '24px', padding: '45px 35px', width: 'min(95%, 540px)', boxShadow: '0 30px 70px rgba(0,0,0,0.4)', textAlign: 'center', animation: 'floatIn 0.9s ease-out' },
    logo: { height: '85px', marginBottom: '25px', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.25))' },
    title: { fontSize: '2.3rem', fontWeight: '800', color: '#1e40af', margin: '15px 0 8px', fontFamily: "'Montserrat', sans-serif" },
    subtitle: { color: '#4b5563', fontSize: '1.15rem', marginBottom: '25px' },
    avatar: { width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: '9px solid #3b82f6', boxShadow: '0 15px 40px rgba(59,130,246,0.5)', margin: '30px auto' },
    avatarPlaceholder: { width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '4.5rem', fontWeight: 'bold', margin: '30px auto', border: '9px solid #3b82f6', boxShadow: '0 15px 40px rgba(59,130,246,0.5)' },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f3f4f6', fontSize: '17px' },
    label: { fontWeight: '700', color: '#1d4ed8', minWidth: '130px' },
    value: { color: '#1f2937', textAlign: 'right', flex: 1, marginLeft: '20px', fontWeight: '500' },
    loading: { color: '#1d4ed8', fontSize: '1.4rem', fontWeight: '600' },
    error: { color: '#dc2626', background: '#fee2e2', padding: '18px', borderRadius: '14px', margin: '25px 0', border: '2px solid #fca5a5', fontWeight: '600' },
    redirectText: { marginTop: '35px', color: '#374151', fontSize: '15.5px', fontStyle: 'italic' },
  };

  return (
    <div style={styles.overlay}>
      <style>{`@keyframes floatIn { from { opacity: 0; transform: translateY(70px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>

      <div style={styles.card}>
        <img src={require('../../assets/LOGO_rectangular.png')} alt="JSport" style={styles.logo} />
        <h1 style={styles.title}>¡Bienvenido!</h1>
        <p style={styles.subtitle}>Sesión verificada correctamente</p>

        {loading && <p style={styles.loading}>Cargando perfil...</p>}
        {errorMessage && <div style={styles.error}>{errorMessage}</div>}

        {currentUser && (
          <>
            {currentUser.userprofile?.profile_picture ? (
              <img src={currentUser.userprofile.profile_picture} alt="Perfil" style={styles.avatar} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                {(currentUser.first_name?.[0] || '') + (currentUser.last_name?.[0] || 'U')}
              </div>
            )}

            <div style={{ marginTop: '35px', width: '100%' }}>
              <div style={styles.infoRow}><span style={styles.label}>Nombre:</span><span style={styles.value}>{currentUser.first_name} {currentUser.last_name}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Correo:</span><span style={styles.value}>{currentUser.email}</span></div>
              <div style={styles.infoRow}><span style={styles.label}>Rol:</span><span style={styles.value}>
                {currentUser.userprofile?.staff_status === 'administrator' ? 'Administrador' :
                 currentUser.userprofile?.staff_status === 'sales' ? 'Ventas' :
                 currentUser.userprofile?.staff_status === 'design' ? 'Diseño' : 'Cliente'}
              </span></div>
              <div style={styles.infoRow}><span style={styles.label}>Teléfono:</span><span style={styles.value}>{currentUser.userprofile?.phone_number || '—'}</span></div>
            </div>

            <p style={styles.redirectText}>Redirigiendo en <strong>2.8s</strong>...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrentUser;