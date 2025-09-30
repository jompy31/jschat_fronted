import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../../assets/LOGO_rectangular.png';
import { useNavigate } from 'react-router-dom';
import TodoDataService from '../../../services/todos';
import './Signup.css';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    re_password: '',
    company: '',
    id_number: '',
    id_type: '',
    phone_number: '',
    address: '',
    staff_status: 'customer',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState('medium');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize(width <= 767 ? 'small' : width <= 1023 ? 'medium' : 'large');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, re_password, company, id_number, id_type, phone_number, address } = formData;

    if (!first_name || !last_name || !email || !password || !re_password || !company || !id_number || !id_type || !phone_number || !address) {
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
      const signupResponse = await TodoDataService.signup({
        first_name,
        last_name,
        email,
        password,
        staff_status: 'customer',
        phone_number,
        address,
      });

      const token = signupResponse.data.token;

      await TodoDataService.createCustomer({
        name: `${first_name} ${last_name}`,
        id_type,
        id_number,
        email,
        phone_number,
        address,
        company,
        tipo_contacto: 'Cliente',
        user: signupResponse.data.user_id || 1,
      }, token);

      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        re_password: '',
        company: '',
        id_number: '',
        id_type: '',
        phone_number: '',
        address: '',
        staff_status: 'customer',
      });

      toast.success('Registro exitoso. Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/users'), 2000);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || '';
      if (errorMsg.includes('El correo electrónico ya está registrado')) {
        toast.error('El correo electrónico ya está registrado. Contacta a soporte@jsport.com.');
      } else if (errorMsg.includes('El número de identificación ya está registrado')) {
        toast.error('El número de identificación ya está registrado. Contacta a soporte@jsport.com.');
      } else {
        toast.error(
          <div>
            Registro fallido. {' '}
            <a href="/users"></a>.
          </div>
        );
      }
    }
  };

  return (
    <div className="signup-page flex items-center justify-center min-h-screen bg-gray-100">
      <div className="auth-wrapper p-4 w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <img src={logo} alt="J SPORT logo" className="signup-logo mx-auto w-32" />
              <h1 className="signup-title text-2xl font-bold text-blue-900 mt-4">¡Regístrate en J SPORT!</h1>
              <p className="signup-subtitle text-sm text-blue-900">Crea tu cuenta para personalizar tus productos deportivos.</p>
            </div>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="font-medium text-blue-900 text-sm py-2">Nombre</div>
                <div className="py-2">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Apellidos</div>
                <div className="py-2">
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Número de Identificación</div>
                <div className="py-2">
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Tipo de Identificación</div>
                <div className="py-2">
                  <select
                    name="id_type"
                    value={formData.id_type}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    <option value="">Seleccionar</option>
                    <option value="Cédula">Cédula</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Correo Electrónico</div>
                <div className="py-2">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Número de Teléfono</div>
                <div className="py-2">
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Dirección</div>
                <div className="py-2">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Contraseña</div>
                <div className="py-2 relative">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    minLength="6"
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button
                    type="button"
                    className="btn-toggle-password absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-900 hover:text-red-600"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {isPasswordVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  <div className="form-text text-xs text-blue-700 mt-1">Mínimo 6 caracteres</div>
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Confirmar Contraseña</div>
                <div className="py-2">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="re_password"
                    value={formData.re_password}
                    onChange={onChange}
                    minLength="6"
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div className="font-medium text-blue-900 text-sm py-2">Empresa</div>
                <div className="py-2">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={onChange}
                    required
                    className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="btn-jsport bg-red-600 text-white border-2 border-red-600 rounded-md px-6 py-2 font-medium hover:bg-red-700 hover:border-red-700 disabled:bg-gray-400 disabled:border-gray-400 transition-colors"
                  disabled={!(formData.email && formData.first_name && formData.last_name && formData.password && formData.re_password && formData.company && formData.id_number && formData.id_type && formData.phone_number && formData.address)}
                >
                  Registrarse
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Signup;