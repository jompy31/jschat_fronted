import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../../assets/categorias/25.webp';
import { useNavigate } from 'react-router-dom';
import TodoDataService from '../../../services/todos';
import axios from 'axios';

const validateEmail = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    re_password: '',
    company: '',
    id_number: '',  // Campo agregado
    id_type: '',    // Campo agregado
  });

  const { first_name, last_name, email, password, re_password, company, id_number, id_type } = formData;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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

    handleResize(); // Llamar a la función al cargar la página

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const sendEmail = async (emailData) => {
    // Crear un objeto para los datos
    const data = {
      subject: emailData.subject,
      message: emailData.message,
      from_email: emailData.from_email,
      recipient_list: emailData.recipient_list.join(','),
      attachments: emailData.attachments,
    };

    try {
      const response = await axios.post('https://abcupon.com/api/send-email/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
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
    // console.log("formdata", formData);

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
      // Registro de usuario
      const response = await TodoDataService.signup(formData);

      // Datos del correo
      const emailData = {
        subject: 'Usuario Nuevo de ABCupon.com',
        message: `Nombre: ${first_name}\nApellido: ${last_name}\nEmail: ${email}\nEmpresa: ${company}`,
        from_email: 'soporte@abcupon.com',
        recipient_list: ['soporte@abcupon.com'],
      };

      // Enviar correo
      await sendEmail(emailData);

      // Resetear los datos del formulario
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

      // Navegar a /login
      navigate('/user');
    } catch (error) {
      console.error(error);

      // Manejar error específico de cédula duplicada
      if (error.response && error.response.data.error && error.response.data.error.includes("La cédula ya está registrada")) {
        toast.error('La cédula ya está registrada. Por favor, contacte a soporte@abcupon.com.');
      }
      // Manejar error específico de correo duplicado
      else if (error.response && error.response.data.error && error.response.data.error.includes("El correo electrónico ya está registrado")) {
        toast.error('El correo electrónico ya está registrado. Por favor, contacte a soporte@abcupon.com.');
      }
      else {
        toast.error(
          <div>
            Registro fallido. Intenta nuevamente o verifica iniciando sesión{' '}
            <a href="/login">aquí</a>.
          </div>
        );
      }
    }
  };
  function togglePasswordVisibility() {
    setIsPasswordVisible(!isPasswordVisible);
  }


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center py-10 px-4 bg-gray-100 min-h-screen">
        <Card className="w-full max-w-2xl p-6 shadow-lg bg-white rounded-lg">
          <Card.Body>
            <div className="flex justify-center mb-4">
              <img src={logo} alt="ABCupon logo" className="max-w-40" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-6">¡Regístrar usuarios en la plataforma ABCupon!</h2>
            <Form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Group controlId="first_name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" name="first_name" value={first_name} onChange={onChange} required className="input-field" />
                </Form.Group>
                <Form.Group controlId="last_name">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control type="text" name="last_name" value={last_name} onChange={onChange} required className="input-field" />
                </Form.Group>
              </div>
              <Form.Group controlId="id_number">
                <Form.Label>Número de Identificación</Form.Label>
                <Form.Control type="text" name="id_number" value={id_number} onChange={onChange} required className="input-field" />
              </Form.Group>
              <Form.Group controlId="id_type">
                <Form.Label>Tipo de Identificación</Form.Label>
                <Form.Control as="select" name="id_type" value={id_type} onChange={onChange} required className="input-field">
                  <option value="">Seleccionar</option>
                  <option value="cedula_nacional">Cédula Nacional</option>
                  <option value="pasaporte">Pasaporte</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" name="email" value={email} onChange={onChange} required className="input-field" />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type={isPasswordVisible ? 'text' : 'password'} name="password" value={password} onChange={onChange} minLength="6" required className="input-field" />
              </Form.Group>
              <Form.Group controlId="re_password">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <div className="relative">
                  <Form.Control type={isPasswordVisible ? 'text' : 'password'} name="re_password" value={re_password} onChange={onChange} minLength="6" required className="input-field" />
                  <button type="button" className="absolute inset-y-0 right-2 flex items-center" onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </Form.Group>
              <Form.Group controlId="company">
                <Form.Label>Empresa</Form.Label>
                <Form.Control type="text" name="company" value={company} onChange={onChange} required className="input-field" />
              </Form.Group>
              <div className="flex justify-center mt-4">
                <Button type="submit" disabled={!email || !first_name || !last_name || !password || !re_password || !company || !id_number || !id_type} className="btn-primary">
                  Registrar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Signup;
