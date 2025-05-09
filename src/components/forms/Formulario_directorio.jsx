import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Formulario_directorio.css'; // Mantengo el archivo CSS, aunque usaremos Tailwind principalmente

const Formulario_directorio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    comercio: {
      nombreComercio: '',
      nombreResponsable: '',
      tipoIdentificacion: '',
      numeroIdentificacion: '',
      telefono: '',
      whatsapp: '',
      correo: '',
      provincia: '',
      canton: '',
      distrito: '',
      direccionExacta: '',
      puntoReferencia: '',
    },
    entrega: {
      direccionEntrega: '',
      provinciaEntrega: '',
      cantonEntrega: '',
      distritoEntrega: '',
      puntoReferenciaEntrega: '',
      horarioEntrega: '',
      diaPreferido: '',
      personaAutorizada: '',
      telefonoAutorizada: '',
    },
    pagos: {
      metodoPago: '',
      telefonoSinpe: '',
      banco: '',
      numeroCuenta: '',
      titularCuenta: '',
    },
    acuerdo: {
      nombreRepresentante: '',
      nombreComercio: '',
      observaciones: '',
    },
    promotor: {
      codigoPromotor: '',
      nombrePromotor: '',
      cedulaPromotor: '',
    },
  });

  // Maneja cambios en inputs de texto
  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  // Maneja cambios en checkboxes
  const handleCheckboxChange = (section, name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [name]: value,
      },
    }));
  };

  // Validación y envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    const requiredFields = [
      formData.comercio.nombreComercio,
      formData.comercio.nombreResponsable,
      formData.comercio.numeroIdentificacion,
      formData.comercio.telefono,
      formData.comercio.direccionExacta,
      formData.pagos.metodoPago,
      formData.pagos.titularCuenta,
      formData.acuerdo.nombreRepresentante,
      formData.promotor.codigoPromotor,
    ];

    if (requiredFields.some((field) => !field)) {
      toast.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Preparar datos para el correo
    const emailData = {
      subject: 'Formulario de Afiliación ABCupon',
      message: `
        Fecha de Afiliación: ${new Date().toLocaleDateString()}
        Código de Promotor: ${formData.promotor.codigoPromotor}

        **Datos del Comercio**
        Nombre del Comercio: ${formData.comercio.nombreComercio}
        Propietario/Responsable: ${formData.comercio.nombreResponsable}
        Tipo de Identificación: ${formData.comercio.tipoIdentificacion}
        Número de Identificación: ${formData.comercio.numeroIdentificacion}
        Teléfono: ${formData.comercio.telefono}
        WhatsApp: ${formData.comercio.whatsapp}
        Correo: ${formData.comercio.correo}
        Ubicación: ${formData.comercio.provincia}, ${formData.comercio.canton}, ${
        formData.comercio.distrito
      }
        Dirección Exacta: ${formData.comercio.direccionExacta}
        Punto de Referencia: ${formData.comercio.puntoReferencia}

        **Datos para Entrega**
        Dirección de Entrega: ${formData.entrega.direccionEntrega || formData.comercio.direccionExacta}
        Ubicación Entrega: ${formData.entrega.provinciaEntrega || formData.comercio.provincia}, ${
        formData.entrega.cantonEntrega || formData.comercio.canton
      }, ${formData.entrega.distritoEntrega || formData.comercio.distrito}
        Punto de Referencia: ${formData.entrega.puntoReferenciaEntrega}
        Horario Preferido: ${formData.entrega.horarioEntrega}
        Día Preferido: ${formData.entrega.diaPreferido}
        Persona Autorizada: ${formData.entrega.personaAutorizada}
        Teléfono Autorizada: ${formData.entrega.telefonoAutorizada}

        **Datos para Pagos**
        Método de Pago: ${formData.pagos.metodoPago}
        Teléfono SINPE: ${formData.pagos.telefonoSinpe}
        Banco: ${formData.pagos.banco}
        Número de Cuenta (IBAN): ${formData.pagos.numeroCuenta}
        Titular de la Cuenta: ${formData.pagos.titularCuenta}

        **Acuerdo de Afiliación**
        Representante: ${formData.acuerdo.nombreRepresentante}
        Comercio: ${formData.acuerdo.nombreComercio}
        Observaciones: ${formData.acuerdo.observaciones}

        **Promotor**
        Nombre del Promotor: ${formData.promotor.nombrePromotor}
        Cédula del Promotor: ${formData.promotor.cedulaPromotor}
      `,
      from_email: 'soporte@abcupon.com',
      recipient_list: ['soporte@abcupon.com'],
    };

    try {
      const response = await axios.post('https://abcupon.com/api/send-email/', emailData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        toast.success('Formulario enviado correctamente.');
        setIsModalOpen(false);
        setFormData({
          comercio: { nombreComercio: '', nombreResponsable: '', tipoIdentificacion: '', numeroIdentificacion: '', telefono: '', whatsapp: '', correo: '', provincia: '', canton: '', distrito: '', direccionExacta: '', puntoReferencia: '' },
          entrega: { direccionEntrega: '', provinciaEntrega: '', cantonEntrega: '', distritoEntrega: '', puntoReferenciaEntrega: '', horarioEntrega: '', diaPreferido: '', personaAutorizada: '', telefonoAutorizada: '' },
          pagos: { metodoPago: '', telefonoSinpe: '', banco: '', numeroCuenta: '', titularCuenta: '' },
          acuerdo: { nombreRepresentante: '', nombreComercio: '', observaciones: '' },
          promotor: { codigoPromotor: '', nombrePromotor: '', cedulaPromotor: '' },
        });
      } else {
        toast.error('Error al enviar el formulario.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo enviar el formulario. Verifica la conexión.');
    }
  };

  // Maneja clics fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setIsModalOpen(false);
    }
  };

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <button
        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        Formulario de Afiliación
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Formulario de Afiliación ABCupon</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sección 1: Datos del Comercio */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos del Comercio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nombreComercio"
                    placeholder="Nombre del Comercio *"
                    value={formData.comercio.nombreComercio}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="nombreResponsable"
                    placeholder="Propietario/Responsable *"
                    value={formData.comercio.nombreResponsable}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.comercio.tipoIdentificacion === 'Cédula Física'}
                        onChange={() => handleCheckboxChange('comercio', 'tipoIdentificacion', 'Cédula Física')}
                        className="hidden"
                      />
                      <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.comercio.tipoIdentificacion === 'Cédula Física' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                        {formData.comercio.tipoIdentificacion === 'Cédula Física' && '✗'}
                      </span>
                      <span className="ml-2">Cédula Física</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.comercio.tipoIdentificacion === 'Cédula Jurídica'}
                        onChange={() => handleCheckboxChange('comercio', 'tipoIdentificacion', 'Cédula Jurídica')}
                        className="hidden"
                      />
                      <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.comercio.tipoIdentificacion === 'Cédula Jurídica' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                        {formData.comercio.tipoIdentificacion === 'Cédula Jurídica' && '✗'}
                      </span>
                      <span className="ml-2">Cédula Jurídica</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="numeroIdentificacion"
                    placeholder="Número de Identificación *"
                    value={formData.comercio.numeroIdentificacion}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono de Contacto *"
                    value={formData.comercio.telefono}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="WhatsApp (opcional)"
                    value={formData.comercio.whatsapp}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="correo"
                    placeholder="Correo Electrónico (opcional)"
                    value={formData.comercio.correo}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    name="provincia"
                    placeholder="Provincia *"
                    value={formData.comercio.provincia}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="canton"
                    placeholder="Cantón *"
                    value={formData.comercio.canton}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="distrito"
                    placeholder="Distrito *"
                    value={formData.comercio.distrito}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="direccionExacta"
                    placeholder="Dirección Exacta *"
                    value={formData.comercio.direccionExacta}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="puntoReferencia"
                    placeholder="Punto de Referencia"
                    value={formData.comercio.puntoReferencia}
                    onChange={(e) => handleInputChange(e, 'comercio')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Sección 2: Datos para Entrega */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos para Entrega de Materiales</h3>
                <input
                  type="text"
                  name="direccionEntrega"
                  placeholder="Dirección de Entrega (si es diferente)"
                  value={formData.entrega.direccionEntrega}
                  onChange={(e) => handleInputChange(e, 'entrega')}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <input
                    type="text"
                    name="provinciaEntrega"
                    placeholder="Provincia"
                    value={formData.entrega.provinciaEntrega}
                    onChange={(e) => handleInputChange(e, 'entrega')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="cantonEntrega"
                    placeholder="Cantón"
                    value={formData.entrega.cantonEntrega}
                    onChange={(e) => handleInputChange(e, 'entrega')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="distritoEntrega"
                    placeholder="Distrito"
                    value={formData.entrega.distritoEntrega}
                    onChange={(e) => handleInputChange(e, 'entrega')}
                    className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  name="puntoReferenciaEntrega"
                  placeholder="Punto de Referencia"
                  value={formData.entrega.puntoReferenciaEntrega}
                  onChange={(e) => handleInputChange(e, 'entrega')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.entrega.horarioEntrega === 'Mañana'}
                      onChange={() => handleCheckboxChange('entrega', 'horarioEntrega', 'Mañana')}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.entrega.horarioEntrega === 'Mañana' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {formData.entrega.horarioEntrega === 'Mañana' && '✗'}
                    </span>
                    <span className="ml-2">Mañana (8:00 a.m. - 12:00 p.m.)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.entrega.horarioEntrega === 'Tarde'}
                      onChange={() => handleCheckboxChange('entrega', 'horarioEntrega', 'Tarde')}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.entrega.horarioEntrega === 'Tarde' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {formData.entrega.horarioEntrega === 'Tarde' && '✗'}
                    </span>
                    <span className="ml-2">Tarde (12:00 p.m. - 5:00 p.m.)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.entrega.horarioEntrega === 'Cualquier horario'}
                      onChange={() => handleCheckboxChange('entrega', 'horarioEntrega', 'Cualquier horario')}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.entrega.horarioEntrega === 'Cualquier horario' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {formData.entrega.horarioEntrega === 'Cualquier horario' && '✗'}
                    </span>
                    <span className="ml-2">Cualquier horario</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="diaPreferido"
                  placeholder="Día Preferido (opcional)"
                  value={formData.entrega.diaPreferido}
                  onChange={(e) => handleInputChange(e, 'entrega')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="personaAutorizada"
                  placeholder="Persona Autorizada *"
                  value={formData.entrega.personaAutorizada}
                  onChange={(e) => handleInputChange(e, 'entrega')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  name="telefonoAutorizada"
                  placeholder="Teléfono de Persona Autorizada *"
                  value={formData.entrega.telefonoAutorizada}
                  onChange={(e) => handleInputChange(e, 'entrega')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Sección 3: Datos para Pagos */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos para Depósito de Pagos</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.pagos.metodoPago === 'SINPE Móvil'}
                      onChange={() => handleCheckboxChange('pagos', 'metodoPago', 'SINPE Móvil')}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.pagos.metodoPago === 'SINPE Móvil' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {formData.pagos.metodoPago === 'SINPE Móvil' && '✗'}
                    </span>
                    <span className="ml-2">SINPE Móvil</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.pagos.metodoPago === 'Transferencia Bancaria'}
                      onChange={() => handleCheckboxChange('pagos', 'metodoPago', 'Transferencia Bancaria')}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.pagos.metodoPago === 'Transferencia Bancaria' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {formData.pagos.metodoPago === 'Transferencia Bancaria' && '✗'}
                    </span>
                    <span className="ml-2">Transferencia Bancaria</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.pagos.metodoPago === 'Depósito Directo'}
                      onChange={() => handleCheckboxChange('pagos', 'metodoPago', 'Depósito Directo')}
                      className="hidden"
                    />
                    <span className={`w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center ${formData.pagos.metodoPago === 'Depósito Directo' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                      {formData.pagos.metodoPago === 'Depósito Directo' && '✗'}
                    </span>
                    <span className="ml-2">Depósito Directo</span>
                  </label>
                </div>
                <input
                  type="tel"
                  name="telefonoSinpe"
                  placeholder="Teléfono SINPE Móvil"
                  value={formData.pagos.telefonoSinpe}
                  onChange={(e) => handleInputChange(e, 'pagos')}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="banco"
                  placeholder="Banco"
                  value={formData.pagos.banco}
                  onChange={(e) => handleInputChange(e, 'pagos')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="numeroCuenta"
                  placeholder="Número de Cuenta (IBAN) *"
                  value={formData.pagos.numeroCuenta}
                  onChange={(e) => handleInputChange(e, 'pagos')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="titularCuenta"
                  placeholder="Titular de la Cuenta *"
                  value={formData.pagos.titularCuenta}
                  onChange={(e) => handleInputChange(e, 'pagos')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Sección 4: Acuerdo de Afiliación */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Acuerdo de Afiliación</h3>
                <p className="text-gray-600 mb-4">
                  Yo, <input
                    type="text"
                    name="nombreRepresentante"
                    placeholder="Nombre del Representante *"
                    value={formData.acuerdo.nombreRepresentante}
                    onChange={(e) => handleInputChange(e, 'acuerdo')}
                    className="border border-gray-300 rounded-lg p-2 inline-block w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />, en representación de <input
                    type="text"
                    name="nombreComercio"
                    placeholder="Nombre del Comercio *"
                    value={formData.acuerdo.nombreComercio}
                    onChange={(e) => handleInputChange(e, 'acuerdo')}
                    className="border border-gray-300 rounded-lg p-2 inline-block w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />, acepto participar como comercio afiliado de ABCupon a partir de abril de 2025. Entiendo que debo exhibir el catálogo físico, rótulos y volantes proporcionados gratuitamente. Recibiré una comisión del 10% sobre ventas generadas, sin obligación de venta directa ni inversión económica. Puedo retirarme notificando a ABCupon sin penalización.
                </p>
              </div>

              {/* Sección 5: Promotor */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Datos del Promotor</h3>
                <input
                  type="text"
                  name="codigoPromotor"
                  placeholder="Código de Promotor *"
                  value={formData.promotor.codigoPromotor}
                  onChange={(e) => handleInputChange(e, 'promotor')}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="nombrePromotor"
                  placeholder="Nombre del Promotor *"
                  value={formData.promotor.nombrePromotor}
                  onChange={(e) => handleInputChange(e, 'promotor')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="cedulaPromotor"
                  placeholder="Cédula del Promotor *"
                  value={formData.promotor.cedulaPromotor}
                  onChange={(e) => handleInputChange(e, 'promotor')}
                  className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Observaciones */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Observaciones Adicionales</h3>
                <textarea
                  name="observaciones"
                  placeholder="Ejemplo: Prefiere entrega después de las 2 p.m."
                  value={formData.acuerdo.observaciones}
                  onChange={(e) => handleInputChange(e, 'acuerdo')}
                  className="border border-gray-300 rounded-lg p-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 w-full md:w-auto"
              >
                Enviar Formulario
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Formulario_directorio;