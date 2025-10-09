import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, ProgressBar } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/LOGO_rectangular.png';
import { Link, useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';
import './Signup.css';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Función para calcular fuerza de contraseña
const passwordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 6) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

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
  const [screenSize, setScreenSize] = useState('medium');
  const navigate = useNavigate();

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
        user: signupResponse.data.user_id,
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

      toast.success('Registro exitoso. Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error(error);
      const errData = error.response?.data || {};
      if (errData.id_number) toast.error('El número de identificación ya está registrado.');
      else if (errData.email) toast.error('El correo electrónico ya está registrado.');
      else toast.error(<div>Registro fallido. Intenta nuevamente o <Link to="/login">inicia sesión aquí</Link>.</div>);
    }
  };

  const pwdScore = passwordStrength(formData.password);
  const pwdMatch = formData.password && formData.password === formData.re_password;

  return (
    <div className="login-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="logo-container">
            <img src={logo} alt="J SPORT logo" className="logo" />
          </div>
          <Card.Title className="card-title">¡Regístrate en J SPORT!</Card.Title>
          <Card.Text className="card-subtitle">Crea tu cuenta para personalizar tus productos deportivos.</Card.Text>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="first_name" value={formData.first_name} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control type="text" name="last_name" value={formData.last_name} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Número de Identificación</Form.Label>
                  <Form.Control type="text" name="id_number" value={formData.id_number} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tipo de Identificación</Form.Label>
                  <Form.Select name="id_type" value={formData.id_type} onChange={onChange} required className="form-control-modern">
                    <option value="">Seleccionar</option>
                    <option value="Cédula">Cédula</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control type="tel" name="phone_number" value={formData.phone_number} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control type="text" name="address" value={formData.address} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="position-relative">
                  <Form.Label>Contraseña</Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control type={isPasswordVisible ? 'text' : 'password'} name="password" value={formData.password} onChange={onChange} required className="form-control-modern" />
                    <button type="button" className="password-toggle" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                      {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  <ProgressBar now={(pwdScore/4)*100} variant={pwdScore<2?'danger':pwdScore<3?'warning':'success'} className="mt-2 progress-modern" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control type={isPasswordVisible ? 'text' : 'password'} name="re_password" value={formData.re_password} onChange={onChange} required isInvalid={formData.re_password && !pwdMatch} isValid={pwdMatch} className="form-control-modern" />
                  <Form.Control.Feedback type="invalid" className="error-message">Las contraseñas no coinciden.</Form.Control.Feedback>
                  <Form.Control.Feedback type="valid" className="valid-feedback">¡Coinciden!</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control type="text" name="company" value={formData.company} onChange={onChange} required className="form-control-modern" />
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className="login-button mt-4" disabled={!formData.email || !formData.password || !pwdMatch}>
              Registrarse
            </Button>

            <div className="links-container mt-3">
              <Link to="/login" className="auth-link">¿Ya tienes una cuenta? Inicia sesión</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Signup;
