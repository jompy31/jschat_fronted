import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/LOGO_rectangular.png';

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
      const response = await axios.post('http://localhost:8000/api/request_reset_password/', {
        email,
      });

      if (response.status === 200) {
        setMessage('Se ha enviado un enlace de recuperación a tu correo.');
        setEmail('');
        // redirigir después de unos segundos
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('No se pudo enviar el enlace. Verifica tu correo.');
      console.log('Error requesting password reset:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ marginTop: '4%' }}>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo ABCupon" className="w-32 h-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Recuperar Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu correo"
              required
            />
          </div>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
