import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaIndustry, FaGlobe } from 'react-icons/fa';

const CompanyDetailModal = ({ show, handleClose, company }) => {
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (company) {
      setCompanyName(company.name || 'Desconocido');
    }
  }, [company]);

  if (!company) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">{companyName}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="mb-6">
          <img
            src={company.logo}
            alt={`${companyName} logo`}
            className="w-full max-w-[300px] max-h-[200px] object-contain rounded-md shadow-md mx-auto"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-600">{company.description || 'No disponible'}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <FaEnvelope className="text-blue-600 mr-2" />
              <span><strong>Email:</strong> {company.contact_email || 'No disponible'}</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-blue-600 mr-2" />
              <span><strong>Teléfono:</strong> {company.phone_number || 'No disponible'}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              <span><strong>Dirección:</strong> {company.address || 'No disponible'}</span>
            </div>
            <div className="flex items-center">
              <FaIndustry className="text-blue-600 mr-2" />
              <span><strong>Industria:</strong> {company.industry || 'No disponible'}</span>
            </div>
            <div className="flex items-center">
              <span><strong>Fecha de Establecimiento:</strong> {company.established_date || 'No disponible'}</span>
            </div>
            <div className="flex items-center">
              <FaGlobe className="text-blue-600 mr-2" />
              <span>
                <strong>Sitio Web:</strong>{' '}
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {company.website}
                  </a>
                ) : (
                  'No disponible'
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;