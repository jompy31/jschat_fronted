import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/imagenes/logo_abcupon.jpg';

const ResetPasswordUser = () => {
  const { reset_token } = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [staffStatus, setStaffStatus] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/reset_password_user/${reset_token}/`);

      if (response.status === 200) {
        // console.log(response.data); // Agregar esta línea para ver la estructura de los datos recibidos

        const data = response.data;
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setCompany(data.company);
        setStaffStatus(data.staff_status);
        setNewPassword('');
      } else {
        console.log('Error fetching user data');
      }
    } catch (error) {
      console.log('Error fetching user data', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Actualizamos los estados de los campos individuales
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'company':
        setCompany(value);
        break;
      case 'staffStatus':
        setStaffStatus(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      default:
        break;
    }
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/reset_password_user/${reset_token}/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        company: company,
        staff_status: staffStatus,
        password: newPassword,
      });

      if (response.status === 200) {
        console.log('Los datos del usuario cambiaron exitosamente.');
        // Puedes redirigir al usuario a una página de éxito aquí
      } else {
        console.log('Error al cambiar los datos del usuario.');
      }
      navigate('/login');
    } catch (error) {
      console.log('Error changing user data', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" style={{ marginTop: "4%" }}>
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="Logo ABCupon"
            className="w-32 h-auto"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Restablecer Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Apellido
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu apellido"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Empresa
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Ingresa el nombre de tu empresa"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nueva Contraseña
            </label>
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
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Confirmar Contraseña
            </label>
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