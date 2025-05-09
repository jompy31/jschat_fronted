import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import logo from '../../../assets/categorias/25.webp';
import { useNavigate } from 'react-router-dom';
import TodoDataService from '../../../services/todos';
import axios from 'axios';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    re_password: '',
    company: '',
    id_number: '',
    id_type: '',
  });

  const { first_name, last_name, email, password, re_password, company, id_number, id_type } = formData;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState('medium');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 767) {
        setScreenSize('small');
      } else if (width <= 1023) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendEmail = async (emailData) => {
    const data = {
      subject: emailData.subject,
      message: emailData.message,
      from_email: emailData.from_email,
      recipient_list: emailData.recipient_list.join(','),
      attachments: emailData.attachments,
    };

    try {
      const response = await axios.post('https://abcupon.com/api/send-email/', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        toast.success('Correo electrónico enviado correctamente.');
      } else {
        throw new Error('Error al enviar el correo.');
      }
    } catch (error) {
      console.error('No se pudo enviar el correo electrónico:', error);
      toast.error('No se pudo enviar el correo electrónico. Verifica la configuración.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!first_name || !last_name || !email || !password || !re_password || !company || !id_number || !id_type) {
      toast.error('Por favor completa todos los campos.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Por favor ingresa un correo válido.');
      return;
    }

    if (password !== re_password) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await TodoDataService.signup(formData);
      const emailData = {
        subject: 'Usuario Nuevo de ABCupon.com',
        message: `Nombre: ${first_name}\nApellido: ${last_name}\nEmail: ${email}\nEmpresa: ${company}`,
        from_email: 'soporte@abcupon.com',
        recipient_list: ['soporte@abcupon.com'],
      };

      await sendEmail(emailData);

      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        re_password: '',
        company: '',
        id_number: '',
        id_type: '',
      });

      toast.success('Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/user'), 2000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.error) {
        if (error.response.data.error.includes("La cédula ya está registrada")) {
          toast.error('La cédula ya está registrada. Por favor, contacte a soporte@abcupon.com.');
        } else if (error.response.data.error.includes("El correo electrónico ya está registrado")) {
          toast.error('El correo electrónico ya está registrado. Por favor, contacte a soporte@abcupon.com.');
        } else {
          toast.error(
            <div>
              Registro fallido. Intenta nuevamente o verifica iniciando sesión{' '}
              <a href="/login" className="underline text-blue-600 hover:text-blue-800">
                aquí
              </a>.
            </div>
          );
        }
      } else {
        toast.error('Error en el servidor. Intenta nuevamente.');
      }
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="ABCupon logo" className="w-32 h-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Regístrate en ABCupon
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={first_name}
                onChange={onChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Apellidos
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={last_name}
                onChange={onChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ingresa tus apellidos"
              />
            </div>
          </div>
          <div>
            <label htmlFor="id_number" className="block text-sm font-medium text-gray-700">
              Número de Identificación
            </label>
            <input
              type="text"
              id="id_number"
              name="id_number"
              value={id_number}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ingresa tu número de identificación"
            />
          </div>
          <div>
            <label htmlFor="id_type" className="block text-sm font-medium text-gray-700">
              Tipo de Identificación
            </label>
            <select
              id="id_type"
              name="id_type"
              value={id_type}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Seleccionar</option>
              <option value="cedula_nacional">Cédula Nacional</option>
              <option value="pasaporte">Pasaporte</option>
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                minLength="6"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                title={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="re_password" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                id="re_password"
                name="re_password"
                value={re_password}
                onChange={onChange}
                minLength="6"
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Confirma tu contraseña"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                title={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Empresa
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={company}
              onChange={onChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ingresa el nombre de la empresa"
            />
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!email || !first_name || !last_name || !password || !re_password || !company || !id_number || !id_type}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md"
            >
              <FiUserPlus className="mr-2" />
              Registrar
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Signup;