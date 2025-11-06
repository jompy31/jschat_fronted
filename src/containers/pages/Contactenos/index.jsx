import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
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

  const generateCaptcha = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newCaptcha = '';
    for (let i = 0; i < 6; i++) {
      newCaptcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(newCaptcha);
    setValidCaptcha(false);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleCaptchaChange = (e) => {
    setValidCaptcha(e.target.value === captcha);
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validCaptcha) return alert('Captcha incorrecto.');

    const data = {
      subject: `Consulta J SPORT - ${subject}`,
      message: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nEmpresa: ${company}\n\n${message}`,
      from_email: 'contacto@jsport.com',
      recipient_list: 'contacto@jsport.com',
    };

    const send = (payload, isFormData = false) => {
      axios.post(
        'https://jsport-backend.com/send-email/',
        isFormData ? payload : JSON.stringify(data),
        { headers: { 'Content-Type': isFormData ? 'multipart/form-data' : 'application/json' } }
      )
      .then(() => {
        alert('¡Mensaje enviado!');
        setName(''); setEmail(''); setPhone(''); setCompany(''); setSubject(''); setMessage(''); setAttachment(null);
        generateCaptcha();
      })
      .catch(() => alert('Error al enviar.'));
    };

    if (attachment) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('attachments', attachment);
      send(formData, true);
    } else {
      send(data);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="contact-container">
      {/* === HERO - RESPONSIVO === */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="hero-section"
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            style={{
              fontSize: 'clamp(2.2rem, 7vw, 5rem)',
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            Contáctanos
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)',
              lineHeight: '1.7'
            }}
          >
            En J SPORT, estamos comprometidos en brindarte una experiencia única en personalización de productos deportivos y empresariales. ¡Envíanos tu consulta!
          </motion.p>
        </div>
      </motion.section>

      {/* === FORMULARIO - 100% CONTENIDO === */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={sectionVariants}
  className="form-section"
>
  <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
    <motion.form
      ref={contactFormRef}
      onSubmit={handleSubmit}
      className="contact-form mx-auto"
      style={{ maxWidth: '100%' }}
    >
      {/* TÍTULO RESPONSIVO */}
      <h2 
        className="form-title"
        style={{
          fontSize: 'clamp(1.6rem, 5.5vw, 2.2rem)',
          lineHeight: '1.2',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          padding: '0 0.5rem',
          maxWidth: '100%',
          margin: '0 auto 1.5rem'
        }}
      >
        Formulario de Contacto
      </h2>

      <div className="form-grid">
        <Input label="Nombre" id="name" value={name} setValue={setName} required />
        <Input label="Correo Electrónico" id="email" type="email" value={email} setValue={setEmail} required />
        <Input label="Número de Teléfono" id="phone" value={phone} setValue={setPhone} />
        <Input label="Empresa" id="company" value={company} setValue={setCompany} />
        <Input label="Asunto" id="subject" value={subject} setValue={setSubject} required span={2} />
        <Textarea label="Mensaje" id="message" value={message} setValue={setMessage} required span={2} />
        <FileInput label="Archivos Adjuntos" id="attachment" onChange={handleFileChange} span={2} />
        
        {/* CAPTCHA */}
        <div className="captcha-container" style={{ gridColumn: '1 / -1' }}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2">
            <img
              src={`https://dummyimage.com/120x50/001a4d/ffffff&text=${captcha}`}
              alt="Captcha"
              className="captcha-image w-full max-w-[120px] h-auto"
            />
            <button type="button" onClick={generateCaptcha} className="captcha-refresh w-full sm:w-auto text-xs sm:text-sm">
              Actualizar
            </button>
          </div>
          <input
            type="text"
            onChange={handleCaptchaChange}
            placeholder="Ingresa el captcha"
            className="captcha-input text-xs sm:text-sm"
            required
          />
          {!validCaptcha && <p className="captcha-error text-xs">Captcha incorrecto</p>}
        </div>

        {/* ENVIAR */}
        <div className="submit-container" style={{ gridColumn: '1 / -1' }}>
          <button type="submit" disabled={!validCaptcha} className="submit-btn w-full sm:w-auto">
            Enviar Mensaje
          </button>
        </div>
      </div>
    </motion.form>
  </div>
</motion.section>

      {/* === MAPA - RESPONSIVO === */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="map-section"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <h2 
            className="section-title"
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3rem)',
              wordBreak: 'break-word'
            }}
          >
            Encuéntranos
          </h2>
          <div className="map-container">
            <iframe
              title="Ubicación J SPORT"
              src="https://www.google.com/maps/embed?pb=!1m17!1m8!1m3!1d3929.824640014565!2d-84.1081463!3d9.948544!3m2!1i1024!2i768!4f13.1!4m6!3e6!4m0!4m3!3m2!1d9.948533399999999!2d-84.10564649999999!5e0!3m2!1ses-419!2scr!4v1707616204816!5m2!1ses-419!2scr"
              width="100%"
              height="450"
              allowFullScreen=""
              loading="lazy"
              className="map-iframe"
            ></iframe>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

// Componentes reutilizables
const Input = ({ label, id, type = "text", value, setValue, required, span = 1 }) => (
  <div style={{ gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
    <label htmlFor={id} className="input-label text-sm xs:text-base">{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="form-input text-sm xs:text-base"
      placeholder={label}
      required={required}
    />
  </div>
);

const Textarea = ({ label, id, value, setValue, required, span = 1 }) => (
  <div style={{ gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
    <label htmlFor={id} className="input-label text-sm xs:text-base">{label}</label>
    <textarea
      id={id}
      rows={4}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="form-input text-sm xs:text-base"
      placeholder={label}
      required={required}
    />
  </div>
);

const FileInput = ({ label, id, onChange, span = 1 }) => (
  <div style={{ gridColumn: span === 2 ? '1 / -1' : 'auto' }}>
    <label htmlFor={id} className="input-label text-sm xs:text-base">{label}</label>
    <input type="file" id={id} onChange={onChange} className="form-file text-xs xs:text-sm" />
  </div>
);

export default Contact;