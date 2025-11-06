// frontend_github\jschat_fronted\src\components\login\resetpassworduser.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/LOGO_rectangular.png';

const ResetPasswordUser = () => {
  const { reset_token } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar datos del usuario usando el token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://dirlux.com/programas/backendjsapp/api/reset_password_user/${reset_token}/`, {
          headers: { 'Authorization': `Token ${reset_token}` }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Enlace inválido o expirado.');
        setLoading(false);
      }
    };
    if (reset_token) fetchUserData();
  }, [reset_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const response = await axios.post(
        `https://dirlux.com/programas/backendjsapp/api/reset_password_user/${reset_token}/`,
        { password: newPassword },
        { headers: { 'Authorization': `Token ${reset_token}` } }
      );

      setMessage('¡Contraseña actualizada con éxito! Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Error al cambiar la contraseña. El enlace puede haber expirado.');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;
  if (error && !userData.email) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="DirLux" className="w-40" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Cambiar Contraseña</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Correo</label>
            <input
              type="email"
              value={userData.email || ''}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              minLength="8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              minLength="8"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordUser;