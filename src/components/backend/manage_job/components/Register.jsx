import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/categorias/25.webp';
import { signup, sendEmail } from '../utils/api';
import { validateEmail } from '../utils/formUtils';

const Register = () => {
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState('medium');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 767) setScreenSize('small');
      else if (width <= 1023) setScreenSize('medium');
      else setScreenSize('large');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, re_password, company, id_number, id_type } = formData;

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
      await signup(formData);
      await sendEmail({
        subject: 'Usuario Nuevo de ABCupon.com',
        message: `Nombre: ${first_name}\nApellido: ${last_name}\nEmail: ${email}\nEmpresa: ${company}`,
        from_email: 'soporte@abcupon.com',
        recipient_list: ['soporte@abcupon.com'],
      });
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
      navigate('/user');
    } catch (error) {
      if (error.response?.data?.error?.includes('La cédula ya está registrada')) {
        toast.error('La cédula ya está registrada. Por favor, contacte a soporte@abcupon.com.');
      } else if (error.response?.data?.error?.includes('El correo electrónico ya está registrado')) {
        toast.error('El correo electrónico ya está registrado. Por favor, contacte a soporte@abcupon.com.');
      } else {
        toast.error(
          <div>
            Registro fallido. Intenta nuevamente o verifica iniciando sesión{' '}
            <a href="/login">aquí</a>.
          </div>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <Card.Body>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="ABCupon logo" className="w-32" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Registro en ABCupon
          </h2>
          <Form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Group controlId="first_name">
                <Form.Label className="text-sm font-medium text-gray-700">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={onChange}
                  required
                  className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Group>
              <Form.Group controlId="last_name">
                <Form.Label className="text-sm font-medium text-gray-700">Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={onChange}
                  required
                  className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Group>
            </div>
            <Form.Group controlId="id_number">
              <Form.Label className="text-sm font-medium text-gray-700">Número de Identificación</Form.Label>
              <Form.Control
                type="text"
                name="id_number"
                value={formData.id_number}
                onChange={onChange}
                required
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group controlId="id_type">
              <Form.Label className="text-sm font-medium text-gray-700">Tipo de Identificación</Form.Label>
              <Form.Control
                as="select"
                name="id_type"
                value={formData.id_type}
                onChange={onChange}
                required
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar</option>
                <option value="cedula_nacional">Cédula Nacional</option>
                <option value="pasaporte">Pasaporte</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label className="text-sm font-medium text-gray-700">Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label className="text-sm font-medium text-gray-700">Contraseña</Form.Label>
              <Form.Control
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={onChange}
                minLength="6"
                required
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group controlId="re_password">
              <Form.Label className="text-sm font-medium text-gray-700">Confirmar Contraseña</Form.Label>
              <div className="relative">
                <Form.Control
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="re_password"
                  value={formData.re_password}
                  onChange={onChange}
                  minLength="6"
                  required
                  className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FiEyeOff size={20} className="text-gray-500" /> : <FiEye size={20} className="text-gray-500" />}
                </button>
              </div>
            </Form.Group>
            <Form.Group controlId="company">
              <Form.Label className="text-sm font-medium text-gray-700">Empresa</Form.Label>
              <Form.Control
                type="text"
                name="company"
                value={formData.company}
                onChange={onChange}
                required
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                disabled={
                  !formData.email ||
                  !formData.first_name ||
                  !formData.last_name ||
                  !formData.password ||
                  !formData.re_password ||
                  !formData.company ||
                  !formData.id_number ||
                  !formData.id_type
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Registrar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default Register;