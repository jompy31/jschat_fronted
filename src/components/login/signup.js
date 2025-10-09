import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/LOGO_rectangular.png';
import { useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateCedula = (cedula) => /^[0-9]{9,12}$/.test(cedula);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      first_name,
      last_name,
      email,
      password,
      re_password,
      company,
      id_number,
      id_type,
      phone_number,
      address,
    } = formData;

    if (!first_name || !last_name || !email || !password || !re_password || !company || !id_number || !id_type || !phone_number || !address) {
      toast.error('Por favor completa todos los campos.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Por favor ingresa un correo válido.');
      return;
    }

    if (id_type === 'Cédula' && !validateCedula(id_number)) {
      toast.error('Número de cédula inválido. Solo números (9-12 dígitos).');
      return;
    }

    if (password !== re_password) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Validar cédula existente
      const existingById = await TodoDataService.getCustomerByIdNumber(id_number);
      if (Array.isArray(existingById) && existingById.length > 0) {
        toast.error('El número de identificación ya está registrado.');
        return;
      }

      // Validar correo existente
      const userListResponse = await TodoDataService.getUserList();
      const emailExists =
        userListResponse.data?.results?.some((u) => u.email === email) || false;
      if (emailExists) {
        toast.error('El correo electrónico ya está registrado.');
        return;
      }

      // Registrar usuario
      const signupResponse = await TodoDataService.signup({
        first_name,
        last_name,
        email,
        password,
        staff_status: 'customer',
        phone_number,
        address,
      });

      if (!signupResponse?.data?.token || !signupResponse?.data?.user_id) {
        toast.error('Error en el registro. Intenta nuevamente.');
        return;
      }

      const token = signupResponse.data.token;

      // Crear cliente asociado
      await TodoDataService.createCustomer(
        {
          name: `${first_name} ${last_name}`,
          id_type,
          id_number,
          email,
          phone_number,
          address,
          company,
          tipo_contacto: 'Cliente',
          user: signupResponse.data.user_id,
        },
        token
      );

      // Limpiar formulario
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
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMsg = error.response?.data?.error || '';

      if (errorMsg.includes('correo')) {
        toast.error('El correo electrónico ya está registrado.');
      } else if (errorMsg.includes('identificación')) {
        toast.error('El número de identificación ya está registrado.');
      } else {
        toast.error('Registro fallido. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="signup-page flex items-center justify-center min-h-screen bg-gray-100">
      <div className="auth-wrapper p-4 w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <img
                src={logo}
                alt="J SPORT logo"
                className="signup-logo mx-auto w-32"
              />
              <h1 className="signup-title text-2xl font-bold text-blue-900 mt-4">
                ¡Regístrate en J SPORT!
              </h1>
              <p className="signup-subtitle text-sm text-blue-900">
                Crea tu cuenta para personalizar tus productos deportivos.
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="first_name"
                placeholder="Nombre"
                value={formData.first_name}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Apellido"
                value={formData.last_name}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />

              {/* ---- Contraseña ---- */}
              <div className="relative w-full">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control-jsport w-full px-3 py-2"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              <input
                type={isPasswordVisible ? 'text' : 'password'}
                name="re_password"
                placeholder="Repite la contraseña"
                value={formData.re_password}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />

              <input
                type="text"
                name="company"
                placeholder="Empresa"
                value={formData.company}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />

              {/* ---- BLOQUE ORIGINAL DEL SELECT ---- */}
              <div className="py-2">
                <select
                  name="id_type"
                  value={formData.id_type}
                  onChange={handleChange}
                  required
                  className="form-control-jsport w-full px-3 py-2 border border-blue-900 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">Seleccionar</option>
                  <option value="Cédula">Cédula</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>

              <input
                type="text"
                name="id_number"
                placeholder="Número de identificación"
                value={formData.id_number}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Teléfono"
                value={formData.phone_number}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Dirección"
                value={formData.address}
                onChange={handleChange}
                className="form-control-jsport w-full px-3 py-2"
              />

              <div className="col-span-2 text-center mt-4">
                <button
                  type="submit"
                  className="btn-jsport bg-red-600 text-white px-6 py-2 rounded-md"
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
