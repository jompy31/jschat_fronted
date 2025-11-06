import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/LOGO_rectangular.png';
import './RequestPasswordReset.css'; // 👈 Importa los estilos

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://dirlux.com/programas/backendjsapp/api/reset_password/', { email });
      if (response.status === 200) {
        setMessage('Se ha enviado un enlace de recuperación a tu correo.');
        setEmail('');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('No se pudo enviar el enlace. Verifica tu correo.');
      console.error('Error requesting password reset:', err);
    }
  };

  return (
    <div className="request-reset-container">
      <div className="request-reset-card">
        <img src={logo} alt="Logo" className="request-reset-logo" />
        <h2 className="request-reset-title">Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <label className="request-reset-label">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="request-reset-input"
            placeholder="Ingresa tu correo"
            required
          />

          {message && <p className="request-reset-message">{message}</p>}
          {error && <p className="request-reset-error">{error}</p>}

          <button type="submit" className="request-reset-button">
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;