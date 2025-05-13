import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
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
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {company ? 'Editar Empresa' : 'Crear Empresa'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formCompanyName">
            <Form.Label className="text-sm font-medium text-gray-700">Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyLogo">
            <Form.Label className="text-sm font-medium text-gray-700">Logo</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setLogo(e.target.files[0])}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyWebsite">
            <Form.Label className="text-sm font-medium text-gray-700">Sitio Web</Form.Label>
            <Form.Control
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyDescription">
            <Form.Label className="text-sm font-medium text-gray-700">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyEmail">
            <Form.Label className="text-sm font-medium text-gray-700">Email de Contacto</Form.Label>
            <Form.Control
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyPhone">
            <Form.Label className="text-sm font-medium text-gray-700">Número de Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyAddress">
            <Form.Label className="text-sm font-medium text-gray-700">Dirección</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyIndustry">
            <Form.Label className="text-sm font-medium text-gray-700">Industria</Form.Label>
            <Form.Control
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formCompanyEstablishedDate">
            <Form.Label className="text-sm font-medium text-gray-700">Fecha de Creación</Form.Label>
            <DatePicker
              selected={establishedDate}
              onChange={(date) => setEstablishedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholderText="Selecciona una fecha"
            />
          </Form.Group>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CompanyModal;