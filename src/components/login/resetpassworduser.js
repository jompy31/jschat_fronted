import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/LOGO_rectangular.png';

const ResetPasswordUser = () => {
  const { reset_token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `https://dirlux.com/programas/backendjsapp/api/reset_password_user/${reset_token}/`,
        { password: newPassword }
      );

      setMessage('¡Contraseña cambiada con éxito! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError('Enlace inválido o expirado. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="DirLux" className="h-16" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Cambiar Contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength="8"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength="8"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
          >
            {loading ? 'Cambiendo...' : 'Cambiar contraseña'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          ¿Problemas? <a href="/request_reset_password" className="text-blue-600 hover:underline">Solicitar nuevo enlace</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordUser;