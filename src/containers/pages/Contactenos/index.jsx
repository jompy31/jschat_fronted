import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
      alert("Por favor, ingrese el captcha correcto.");
      return;
    }

    const data = {
      subject: `Consulta de ABCupon - ${subject}`,
      message: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nEmpresa: ${company}\n\nMensaje:\n${message}`,
      from_email: 'soporte@abcupon.com',
      recipient_list: 'soporte@abcupon.com',
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
      .post('https://abcupon-backend.com/send-email/', isFormData ? data : JSON.stringify(data), config)
      .then((response) => {
        alert('Correo enviado correctamente.');
      })
      .catch((error) => {
        console.error(error);
        alert('Hubo un error al enviar el correo.');
      });
  };


  return (
    <div>
      <div data-scroll-section className="pt-28 ">

        <div className="max-w-lg mx-auto text-center">

          <h2
            style={{
              color: "red",
              fontWeight: "bold",
              textShadow: "2px 2px 4px #000", // Sombra roja
              textTransform: "none",
            }}
          >Contacto</h2>
          <p className="text-lg mb-4">
            En ABCupon.com, estamos comprometidos en brindarle una experiencia única al alcance de su mano. Somos una plataforma virtual que reúne una amplia variedad de proveedores de servicios, todos ellos avalados en confiabilidad por nuestros estándares.
          </p>
        </div>
        <div>
          <div className="mt-8 space-y-6">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">

                <form id="contact-form" ref={contactFormRef} onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Formulario de Contacto</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Escribe tu nombre"
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
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="tucorreo@ejemplo.com"
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
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Motivo de tu mensaje"
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
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Escribe tu mensaje aquí"
                      ></textarea>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">Archivos Adjuntos</label>
                      <input
                        type="file"
                        name="attachment"
                        id="attachment"
                        onChange={handleFileChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <div className="flex items-center mb-2">
                        <img src={`https://dummyimage.com/100x40/000000/ffffff&text=${captcha}`} alt="Captcha" className="mr-4 rounded-lg border border-gray-300" />
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Actualizar Captcha
                        </button>
                      </div>
                      <input
                        type="text"
                        onChange={handleCaptchaChange}
                        className="block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ingresa el captcha"
                        required
                      />
                      {!validCaptcha && <p className="text-red-500 mt-2">Por favor ingresa el captcha correcto.</p>}
                    </div>
                    <div className="col-span-1 sm:col-span-2 text-center">
                      <button
                        type="submit"
                        disabled={!validCaptcha}
                        className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        Enviar Correo
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto mt-8">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m17!1m8!1m3!1d3929.824640014565!2d-84.1081463!3d9.948544!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d9.948533399999999!2d-84.10564649999999!5e0!3m2!1ses-419!2scr!4v1707616204816!5m2!1ses-419!2scr"
            width="100%"
            height="400"
            frameBorder="0"
            style={{
              border: '2px solid black',      // Borde negro
              borderRadius: '10px',           // Esquinas redondeadas
              boxShadow: '0px 0px 10px red', // Sombreado negro
            }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;
