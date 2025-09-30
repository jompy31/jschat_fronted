import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import './Contact.css';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [validCaptcha, setValidCaptcha] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const contactFormRef = useRef(null);

  const generateRandomCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captcha += characters.charAt(randomIndex);
    }
    return captcha;
  };

  const generateCaptcha = () => {
    const randomCaptcha = generateRandomCaptcha();
    setCaptcha(randomCaptcha);
    setValidCaptcha(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCaptchaChange = (e) => {
    const inputCaptcha = e.target.value;
    setValidCaptcha(inputCaptcha === captcha);
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validCaptcha) {
      alert('Por favor, ingrese el captcha correcto.');
      return;
    }

    const data = {
      subject: `Consulta de J SPORT - ${subject}`,
      message: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nEmpresa: ${company}\n\nMensaje:\n${message}`,
      from_email: 'contacto@jsport.com',
      recipient_list: 'contacto@jsport.com',
    };

    if (attachment) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('attachments', attachment);
      sendEmail(formData, true);
    } else {
      sendEmail(data);
    }
  };

  const sendEmail = (data, isFormData = false) => {
    const config = {
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      },
    };

    axios
      .post('https://jsport-backend.com/send-email/', isFormData ? data : JSON.stringify(data), config)
      .then((response) => {
        alert('Correo enviado correctamente.');
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setSubject('');
        setMessage('');
        setAttachment(null);
        generateCaptcha();
      })
      .catch((error) => {
        console.error(error);
        alert('Hubo un error al enviar el correo.');
      });
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="contact-container">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="pt-28 pb-16 bg-gray-100"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-jsport-blue mb-4">Contáctanos</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            En J SPORT, estamos comprometidos en brindarte una experiencia única en personalización de productos deportivos y empresariales. ¡Envíanos tu consulta!
          </p>
        </div>

        <div className="container mx-auto px-4">
          <motion.form
            id="contact-form"
            ref={contactFormRef}
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            variants={sectionVariants}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-jsport-blue mb-6 text-center">Formulario de Contacto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="Escribe tu nombre"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="123-456-7890"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Empresa</label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="Motivo de tu mensaje"
                  required
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="Escribe tu mensaje aquí"
                  required
                ></textarea>
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">Archivos Adjuntos</label>
                <input
                  type="file"
                  name="attachment"
                  id="attachment"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center mb-2">
                  <img
                    src={`https://dummyimage.com/100x40/000000/ffffff&text=${captcha}`}
                    alt="Captcha"
                    className="mr-4 rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="bg-jsport-red text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jsport-red"
                  >
                    Actualizar Captcha
                  </button>
                </div>
                <input
                  type="text"
                  onChange={handleCaptchaChange}
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-jsport-red focus:border-jsport-red"
                  placeholder="Ingresa el captcha"
                  required
                />
                {!validCaptcha && <p className="text-jsport-red mt-2">Por favor ingresa el captcha correcto.</p>}
              </div>
              <div className="col-span-1 sm:col-span-2 text-center">
                <button
                  type="submit"
                  disabled={!validCaptcha}
                  className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-jsport-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jsport-red disabled:opacity-50"
                >
                  Enviar Correo
                </button>
              </div>
            </div>
          </motion.form>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true }}
          className="container mx-auto px-4 mt-8"
        >
          <h2 className="text-2xl font-bold text-jsport-blue mb-4 text-center">Encuéntranos</h2>
          <iframe
            title="Ubicación de J SPORT"
            src="https://www.google.com/maps/embed?pb=!1m17!1m8!1m3!1d3929.824640014565!2d-84.1081463!3d9.948544!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d9.948533399999999!2d-84.10564649999999!5e0!3m2!1ses-419!2scr!4v1707616204816!5m2!1ses-419!2scr"
            width="100%"
            height="400"
            frameBorder="0"
            style={{
              border: '2px solid #D90404',
              borderRadius: '10px',
              boxShadow: '0px 0px 10px rgba(217, 4, 4, 0.5)',
            }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Contact;