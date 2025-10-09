import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/LOGO_rectangular.png';

const ResetPasswordUser = () => {
  const { reset_token } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [staffStatus, setStaffStatus] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  // 🔹 Simulación JSON para fetchUserData
  const fetchUserData = () => {
    if (!reset_token) {
      console.warn("No se encontró el token de reseteo");
      return;
    }
    console.warn("Simulando fetch user data");
    return Promise.resolve({
      data: {
        first_name: "Juan",
        last_name: "Perez",
        email: "juan@example.com",
        company: "MiEmpresa",
        staff_status: "active"
      }
    }).then((res) => {
      const data = res.data;
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setEmail(data.email);
      setCompany(data.company);
      setStaffStatus(data.staff_status);
      setNewPassword('');
    });
  };

  // 🔹 Simulación JSON para handleSubmit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match.');
      return;
    }

    console.warn("Simulando cambio de contraseña");
    return Promise.resolve({
      data: { message: "Tu contraseña ha sido restablecida exitosamente." }
    }).then(() => {
      console.log('Contraseña restablecida exitosamente.');
      navigate('/login');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ marginTop: "4%" }}>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo ABCupon" className="w-32 h-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu apellido"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Empresa</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa el nombre de tu empresa"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Nueva Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Confirma tu contraseña"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordUser;
