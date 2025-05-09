import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/imagenes/logo_abcupon.jpg';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/navigation/Footer';
import Navbar from '../../components/navigation/Navbar';
import TodoDataService from '../../services/todos';
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
            const response = await axios.post('https://abcupon-backend.com/send-email/', data, {
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
            navigate('/login');
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
        <div>
            <Navbar />
            <div
                className="auth-wrapper d-flex align-center justify-center pa-4"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(20%, 7%)',
                    overflowY: "auto"
                }}
            >
                <br />
                <br />
                <br />
                <br />
                <br />
                <Card
                    className="auth-card pa-4 pt-7"
                    style={{
                        maxWidth: screenSize === 'small' ? '80%' : '50%', // Establece el ancho al 100% en pantallas pequeñas
                        minHeight: "100vh",
                        overflowY: "auto"
                    }}
                >
                    <Card.Body>
                        <div className="d-flex justify-content-center">
                            <img src={logo} alt="ABCupon logo" style={{ maxWidth: '50%', marginLeft: "20%" }} />
                        </div>

                        <Card.Text>
                            <strong className="pt-2 text-white font-weight-semibold" style={{ textShadow: '1px 1px 2px black', fontSize: '20px' }}>¡Regístrate en la plataforma ABCupon!</strong>
                            <br />
                            <strong className="pt-2 text-white font-weight-semibold" style={{ textShadow: '1px 1px 2px black', fontSize: '18px' }}>
                                Crea tu cuenta y comienza a explorar.
                            </strong>
                        </Card.Text>
                        <br />
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="first_name">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={first_name}
                                            onChange={onChange}
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="last_name">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Apellidos</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={last_name}
                                            onChange={onChange}
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="id_number">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Número de Identificación</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="id_number"
                                            value={id_number}
                                            onChange={onChange}
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="id_type">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Tipo de Identificación</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="id_type"
                                            value={id_type}
                                            onChange={onChange}
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="cedula_nacional">Cédula Nacional</option>
                                            <option value="pasaporte">Pasaporte</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="email">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Correo electronico</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="password">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Contraseña</Form.Label>
                                        <Form.Control
                                            type={isPasswordVisible ? 'text' : 'password'}
                                            name="password"
                                            value={password}
                                            onChange={onChange}
                                            minLength="6"
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="re_password">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Confirmar Contraseña</Form.Label>
                                        <div className="input-group">
                                            <Form.Control
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                name="re_password"
                                                value={re_password}
                                                onChange={onChange}
                                                minLength="6"
                                                required
                                                style={{
                                                    borderRadius: '0.5rem',
                                                    border: '1px solid blue',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="input-group-text border-0 bg-transparent"
                                                onClick={togglePasswordVisibility}
                                                style={{
                                                    backgroundColor: '#f38989', // Color verde
                                                    color: 'white', // Asegura que el ícono sea visible
                                                    fontSize: '28px', // Aumenta el tamaño de la fuente (doble de 14px)
                                                    padding: '12px 24px', // Aumenta el tamaño del botón
                                                    borderRadius: '5px', // Bordes redondeados (opcional)
                                                    transition: 'background-color 0.3s ease', // Transición suave
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#0869fa'; // Verde más oscuro al pasar el mouse
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#f38989'; // Vuelve al color verde original
                                                }}
                                            >
                                                {isPasswordVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                            </button>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="company">
                                        <Form.Label className="pt-2 text-black" style={{ textShadow: '1px 1px 2px black', fontSize: '16px' }}>Empresa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="company"
                                            value={company}
                                            onChange={onChange}
                                            required
                                            style={{
                                                borderRadius: '0.5rem',
                                                marginBottom: '1rem',
                                                border: '1px solid blue',
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                            </Row>

                            <div className="d-flex align-items-center justify-content-between mt-1 mb-4" style={{ display: 'flex', flexDirection: 'column' }}>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={!(
                                        email &&
                                        first_name &&
                                        last_name &&
                                        password &&
                                        re_password &&
                                        company &&
                                        id_number &&
                                        id_type
                                    )}
                                    style={{
                                        color: 'white',
                                        textShadow: '1px 1px 2px black',
                                        borderRadius: '5px',
                                        padding: '8px 16px',
                                        border: '2px solid transparent',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#0056b3'; // azul oscuro
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#007bff'; // azul
                                    }}
                                >
                                    Registrarse
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            <Footer />
            <ToastContainer position="top-right" />
        </div >
    );
}

export default Signup;
