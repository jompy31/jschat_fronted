import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/LOGO_rectangular.png';
import { Link, useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const validateField = (name, value, formData) => {
    let error = '';
    switch (name) {
      case 'first_name':
        if (!value) error = 'El nombre es requerido';
        break;
      case 'last_name':
        if (!value) error = 'Los apellidos son requeridos';
        break;
      case 'email':
        if (!value) error = 'El correo electrónico es requerido';
        else if (!validateEmail(value)) error = 'Por favor ingresa un correo válido';
        break;
      case 'phone_number':
        if (!value) error = 'El número de teléfono es requerido';
        else if (!/^\d{8}$/.test(value.replace(/\s/g, ''))) error = 'El número de teléfono debe tener 8 dígitos';
        break;
      case 'id_type':
        if (!value) error = 'El tipo de identificación es requerido';
        break;
      case 'id_number':
        if (!value) error = 'El número de identificación es requerido';
        else if (formData.id_type === 'Cédula' && !/^\d{6,10}$/.test(value)) error = 'La cédula debe tener entre 6 y 10 dígitos';
        else if (formData.id_type === 'Pasaporte' && !/^[A-Za-z0-9]{4,20}$/.test(value)) error = 'El pasaporte debe ser alfanumérico de 4 a 20 caracteres';
        break;
      case 'address':
        if (!value) error = 'La dirección es requerida';
        break;
      case 'company':
        if (!value) error = 'La empresa es requerida';
        break;
      case 'password':
        if (!value) error = 'La contraseña es requerida';
        else if (value.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 're_password':
        if (!value) error = 'Confirma tu contraseña';
        else if (value !== formData.password) error = 'Las contraseñas no coinciden';
        break;
      default:
        break;
    }
    return error;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const error = validateField(name, value, { ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validar todos los campos en submit
    const validationErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'staff_status') {
        const error = validateField(key, formData[key], formData);
        if (error) validationErrors[key] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Payload para signup
      const signupPayload = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        staff_status: 'customer',
        phone_number: formData.phone_number,
        address: formData.address,
      };

      console.debug('Intentando registro con payload:', signupPayload);

      // 1) Crear usuario (signup)
      const signupResponse = await TodoDataService.signup(signupPayload);
      console.debug('Respuesta de signup:', signupResponse?.data);

      const token = signupResponse.data.token;
      const userId = signupResponse.data.user_id ?? signupResponse.data.id ?? null;

      if (!userId || !token) {
        toast.error('Error en el registro: no se recibió información completa del usuario');
        setIsSubmitting(false);
        return;
      }

      // 2) Crear perfil de customer
      try {
        await TodoDataService.createCustomer({
          name: `${formData.first_name} ${formData.last_name}`,
          id_type: formData.id_type,
          id_number: formData.id_number.trim(),
          email: formData.email,
          phone_number: formData.phone_number,
          address: formData.address,
          company: formData.company,
          tipo_contacto: 'Cliente',
          user: userId,
        }, token);

        // Éxito completo - limpiar formulario
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
        setErrors({});

        toast.success('¡Registro exitoso! Redirigiendo al inicio de sesión...');
        setTimeout(() => navigate('/login'), 2000);

      } catch (custErr) {
        // Error al crear customer - hacer rollback
        console.error('Error creando customer:', custErr);
        const custErrData = custErr.response?.data || {};

        // Intentar eliminar el usuario creado para evitar usuarios huérfanos
        try {
          await TodoDataService.deleteUser(userId, token);
          console.info('Usuario eliminado tras fallo en creación de customer');
        } catch (delErr) {
          console.error('Error al eliminar usuario tras fallo:', delErr);
        }

        // Mostrar errores específicos
        if (custErrData.id_number) {
          toast.error('El número de identificación ya está registrado. Por favor usa otro número.');
          setErrors(prev => ({ ...prev, id_number: 'El número de identificación ya está registrado' }));
        } else if (custErrData.email) {
          toast.error('El correo electrónico ya está registrado. Por favor usa otro correo.');
          setErrors(prev => ({ ...prev, email: 'El correo electrónico ya está registrado' }));
        } else {
          toast.error('Error al crear el perfil de cliente. Por favor intenta nuevamente.');
        }
      }

    } catch (error) {
      console.error('Error en signup:', error);
      const errData = error.response?.data || {};

      // Manejar diferentes tipos de respuesta de error del backend
      if (error.response?.status === 400) {
        if (errData.error) {
          toast.error(errData.error);
        } else if (errData.email) {
          toast.error('El correo electrónico ya está registrado');
          setErrors(prev => ({ ...prev, email: 'El correo electrónico ya está registrado' }));
        } else if (typeof errData === 'object') {
          // Mostrar errores por campo
          Object.entries(errData).forEach(([field, msgs]) => {
            const message = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
            toast.error(`${field}: ${message}`);
            setErrors(prev => ({ ...prev, [field]: message }));
          });
        } else {
          toast.error('Error en el registro. Verifica los datos e intenta nuevamente.');
        }
      } else {
        toast.error('Error de conexión. Por favor intenta más tarde.');
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="auth-card" style={{ maxWidth: '800px' }}>
        <Card.Body>
          <div className="logo-container">
            <img src={logo} alt="JSport Logo" className="logo" />
          </div>
          <Card.Title className="card-title">¡Regístrate en JSport!</Card.Title>
          <Card.Text className="card-subtitle">
            Crea tu cuenta para personalizar tus productos deportivos.
          </Card.Text>
          
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* Nombre */}
              <Col md={6} xs={12}>
                <Form.Group controlId="first_name" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={onChange}
                      placeholder="Ingresa tu nombre"
                      className={`form-control-modern ${errors.first_name ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Apellidos */}
              <Col md={6} xs={12}>
                <Form.Group controlId="last_name" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Apellidos *</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={onChange}
                      placeholder="Ingresa tus apellidos"
                      className={`form-control-modern ${errors.last_name ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.last_name && <div className="error-message">{errors.last_name}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Correo Electrónico */}
              <Col md={6} xs={12}>
                <Form.Group controlId="email" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Correo Electrónico *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      placeholder="correo@ejemplo.com"
                      className={`form-control-modern ${errors.email ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Número de Teléfono */}
              <Col md={6} xs={12}>
                <Form.Group controlId="phone_number" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Número de Teléfono *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={onChange}
                      placeholder="Ej: 87654321"
                      className={`form-control-modern ${errors.phone_number ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.phone_number && <div className="error-message">{errors.phone_number}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Tipo de Identificación */}
              <Col md={6} xs={12}>
                <Form.Group controlId="id_type" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Tipo de Identificación *</Form.Label>
                    <Form.Select
                      name="id_type"
                      value={formData.id_type}
                      onChange={onChange}
                      className={`form-control-modern ${errors.id_type ? 'is-invalid' : ''}`}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Cédula">Cédula</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </Form.Select>
                    {errors.id_type && <div className="error-message">{errors.id_type}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Número de Identificación */}
              <Col md={6} xs={12}>
                <Form.Group controlId="id_number" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Número de Identificación *</Form.Label>
                    <Form.Control
                      type="text"
                      name="id_number"
                      value={formData.id_number}
                      onChange={onChange}
                      placeholder="Número de cédula o pasaporte"
                      className={`form-control-modern ${errors.id_number ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.id_number && <div className="error-message">{errors.id_number}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Dirección */}
              <Col md={6} xs={12}>
                <Form.Group controlId="address" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Dirección *</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={onChange}
                      placeholder="Tu dirección completa"
                      className={`form-control-modern ${errors.address ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.address && <div className="error-message">{errors.address}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Empresa */}
              <Col md={6} xs={12}>
                <Form.Group controlId="company" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Empresa *</Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={onChange}
                      placeholder="Nombre de tu empresa"
                      className={`form-control-modern ${errors.company ? 'is-invalid' : ''}`}
                      required
                    />
                    {errors.company && <div className="error-message">{errors.company}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Contraseña */}
              <Col md={6} xs={12}>
                <Form.Group controlId="password" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Contraseña *</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        placeholder="Mínimo 6 caracteres"
                        className={`form-control-modern ${errors.password ? 'is-invalid' : ''}`}
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                    {errors.password && <div className="error-message">{errors.password}</div>}
                  </div>
                </Form.Group>
              </Col>

              {/* Confirmar Contraseña */}
              <Col md={6} xs={12}>
                <Form.Group controlId="re_password" className="mb-4">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Confirmar Contraseña *</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={isPasswordVisible ? 'text' : 'password'}
                        name="re_password"
                        value={formData.re_password}
                        onChange={onChange}
                        placeholder="Repite tu contraseña"
                        className={`form-control-modern ${errors.re_password ? 'is-invalid' : ''}`}
                        minLength="6"
                        required
                      />
                    </div>
                    {errors.re_password && <div className="error-message">{errors.re_password}</div>}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registrando...
                </>
              ) : (
                'Registrarse'
              )}
            </Button>

            <div className="links-container">
              <Link to="/login" className="auth-link">
                ¿Ya tienes una cuenta? Inicia sesión aquí
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Signup;