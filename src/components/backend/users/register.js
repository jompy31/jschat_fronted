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
        email: '', first_name: '', last_name: '', password: '', re_password: '',
        company: '', id_number: '', id_type: '', phone_number: '', address: '',
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
        toast.error('Registro fallido. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="auth-wrapper">
        <div className="signup-card">
          <img src={logo} alt="J SPORT logo" className="signup-logo" />
          <h1 className="signup-title">¡Regístrate en J SPORT!</h1>
          <p className="signup-subtitle">Crea tu cuenta para personalizar tus productos deportivos.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Apellidos</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Número de Identificación</label>
                <input
                  type="text"
                  name="id_number"
                  value={formData.id_number}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Tipo de Identificación</label>
                <select
                  name="id_type"
                  value={formData.id_type}
                  onChange={onChange}
                  required
                  className="form-select"
                >
                  <option value="">Seleccionar</option>
                  <option value="Cédula">Cédula</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>

              <div>
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Número de Teléfono</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Empresa</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={onChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Contraseña</label>
                <div className="password-group">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={onChange}
                    minLength="6"
                    required
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    aria-label={isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {isPasswordVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                <div className="form-text">Mínimo 6 caracteres</div>
              </div>

              <div>
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="re_password"
                  value={formData.re_password}
                  onChange={onChange}
                  minLength="6"
                  required
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={!(formData.email && formData.first_name && formData.last_name && formData.password && formData.re_password && formData.company && formData.id_number && formData.id_type && formData.phone_number && formData.address)}
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Signup;