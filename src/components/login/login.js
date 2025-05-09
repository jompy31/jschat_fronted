import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/imagenes/logo_abcupon.jpg';
import { Link, useNavigate } from 'react-router-dom';
import TodoDataService from '../../services/todos';
import { useDispatch } from 'react-redux';
import { setAuthentication } from '../../redux/actions/authActions';
import { useMediaQuery } from 'react-responsive';
import './login.css';

function Login(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isMini = useMediaQuery({ query: '(max-width: 340px)' });

  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }

  useEffect(() => {
    const storedUsername = localStorage.getItem('user');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const login = () => {
    TodoDataService.login({ username: username, password: password })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        setUsername('');
        setPassword('');
        setError('');

        dispatch(setAuthentication(token, username));

        navigate('/current_user');
        setTimeout(() => {
          window.location.reload();
          setTimeout(() => {
            navigate('/');
          }, 4000);
        }, 0);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.error;
          setError(errorMessage);
        } else {
          setError('An error occurred. Please try again.');
        }
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  return (
    <div className="login-container">
      <Card className="auth-card">
        <Card.Body>
          <div className="logo-container">
            <img src={logo} alt="ABCupon Logo" className="logo" />
          </div>
          <Card.Title className="card-title">Bienvenido a ABCupon</Card.Title>
          <Card.Text className="card-subtitle">
            Inicie sesión para explorar las nuevas funciones de nuestra plataforma.
          </Card.Text>
          <Form onKeyPress={handleKeyPress}>
            <Row>
              <Col xs={12}>
                <Form.Group controlId="username" className="mb-3">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Ingrese su correo"
                      className="form-control-modern"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="password" className="mb-4">
                  <div className="input-field-container">
                    <Form.Label className="input-label">Contraseña</Form.Label>
                    <div className="password-input-wrapper">
                      <Form.Control
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Ingrese su contraseña"
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
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {error && <div className="error-message">{error}</div>}
            <Button
              variant="primary"
              type="button"
              onClick={login}
              className="login-button"
            >
              Iniciar Sesión
            </Button>
            <div className="links-container">
              <Link to="/reset_password" className="auth-link">
                ¿Olvidó su contraseña?
              </Link>
              <Link to="/signup" className="auth-link signup-link">
                Registrar un nuevo usuario
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Login;