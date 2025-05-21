import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const CompanyModal = ({ show, handleClose, company, handleSave }) => {
  const [name, setName] = useState(company ? company.name : '');
  const [description, setDescription] = useState(company ? company.description : '');
  const [website, setWebsite] = useState(company ? company.website : '');
  const [contactEmail, setContactEmail] = useState(company ? company.contact_email : '');
  const [phoneNumber, setPhoneNumber] = useState(company ? company.phone_number : '');
  const [address, setAddress] = useState(company ? company.address : '');
  const [industry, setIndustry] = useState(company ? company.industry : '');
  const [establishedDate, setEstablishedDate] = useState(company ? new Date(company.established_date) : null);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (company) {
      setName(company.name);
      setDescription(company.description);
      setWebsite(company.website);
      setContactEmail(company.contact_email);
      setPhoneNumber(company.phone_number);
      setAddress(company.address);
      setIndustry(company.industry);
      setEstablishedDate(company.established_date ? new Date(company.established_date) : null);
    } else {
      setName('');
      setDescription('');
      setWebsite('');
      setContactEmail('');
      setPhoneNumber('');
      setAddress('');
      setIndustry('');
      setEstablishedDate(null);
    }
  }, [company]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formattedEstablishedDate = null;
    if (establishedDate) {
      formattedEstablishedDate = moment(establishedDate).format('YYYY-MM-DD');
    }
    handleSave({
      id: company ? company.id : null,
      name,
      description,
      website,
      contact_email: contactEmail,
      phone_number: phoneNumber,
      address,
      industry,
      established_date: formattedEstablishedDate,
      logo,
    });
    setName('');
    setDescription('');
    setWebsite('');
    setContactEmail('');
    setPhoneNumber('');
    setAddress('');
    setIndustry('');
    setEstablishedDate(null);
    setLogo(null);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {company ? 'Editar Empresa' : 'Crear Empresa'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <label className="text-sm font-medium text-gray-700 self-center text-left">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Logo</label>
            <input
              type="file"
              onChange={(e) => setLogo(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Sitio Web</label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Email de Contacto</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Número de Teléfono</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Industria</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <label className="text-sm font-medium text-gray-700 self-center text-left">Fecha de Creación</label>
            <DatePicker
              selected={establishedDate}
              onChange={(date) => setEstablishedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholderText="Selecciona una fecha"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;