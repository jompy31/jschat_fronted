import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/LOGO_rectangular.png';
import { Link, useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '../../redux/actions/authActions';
import './login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  useEffect(() => {
    const storedUsername = localStorage.getItem('user');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const login = () => {
    TodoDataService.login({ username, password })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        setUsername(''); setPassword(''); setError('');
        dispatch(setAuthentication(token, username));
        navigate('/current_user');
      })
      .catch((error) => {
        setError(error.response?.data?.error || 'Error al iniciar sesión.');
      });
  };

  return (
    <div className="login-container">
      <Card className="auth-card">
        <Card.Body className="p-5">
          <div className="logo-container">
            <img src={logo} alt="JSport Logo" className="logo" />
          </div>
          <Card.Title className="card-title">Bienvenido a JSport</Card.Title>
          <Card.Text className="card-subtitle">
            Inicie sesión para gestionar sus pedidos y personalizaciones.
          </Card.Text>

          <Form onSubmit={(e) => { e.preventDefault(); login(); }}>
            <Row>
              <Col xs={12}>
                <Form.Group controlId="username" className="mb-4">
                  <Form.Label className="input-label">Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="ejemplo@jsport.com"
                    className="form-control-modern"
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group controlId="password" className="mb-4">
                  <Form.Label className="input-label">Contraseña</Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="form-control-modern"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            {error && <div className="error-message">{error}</div>}

            <Button type="submit" className="login-button w-100">
              Iniciar Sesión
            </Button>

            <div className="links-container">
              <Link to="/request_reset_password" className="auth-link">
                ¿Olvidó su contraseña?
              </Link>
              <Link to="/signup" className="auth-link signup-link">
                Crear cuenta nueva
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;