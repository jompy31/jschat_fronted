import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaFileAlt } from 'react-icons/fa';
import ApiService from '../../../../services/products';

const AddEvent = ({ orderId, event, onClose, onEventAdded }) => {
  const [eventType, setEventType] = useState('');
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (event) {
      setEventType(event.event_type || '');
      setDocument(null); // Reset document, as we can't preselect files
    } else {
      setEventType('');
      setDocument(null);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append('event_type', eventType);
    if (document) formData.append('document', document);

    try {
      if (event) {
        // Update existing event
        await ApiService.updateOrderEvent(orderId, event.id, formData, token);
      } else {
        // Create new event
        await ApiService.addOrderEvent(orderId, formData, token);
      }
      onEventAdded();
      onClose();
    } catch (error) {
      console.error(`Error ${event ? 'updating' : 'adding'} event:`, error);
      const errorDetail = error.response?.data?.detail || `Error al ${event ? 'actualizar' : 'agregar'} el evento.`;
      setError(errorDetail);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{event ? 'Editar Evento' : 'Agregar Evento'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Tipo de Evento</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
              required
            >
              <option value="">Seleccione un evento</option>
              <option value="design_approved">Diseño Aprobado</option>
              <option value="payment_50_confirmed">Pago 50% Confirmado</option>
              <option value="delivered">Entregado</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Documento</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files[0])}
              className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
              accept="image/jpeg,image/png,application/pdf"
            />
            {event?.document && !document && (
              <div className="mt-2">
                {event.document.endsWith('.pdf') ? (
                  <a
                    href={event.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-300"
                  >
                    <FaFileAlt className="mr-2" /> Ver Documento Actual
                  </a>
                ) : (
                  <img
                    src={event.document}
                    alt="Documento actual"
                    className="h-24 w-24 object-cover rounded-lg shadow"
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <FaSave className="mr-2" /> {event ? 'Actualizar Evento' : 'Agregar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;