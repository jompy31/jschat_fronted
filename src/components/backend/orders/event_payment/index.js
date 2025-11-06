import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaFileAlt, FaTrash } from 'react-icons/fa';
import ApiService from '../../../../services/products';

const AddEvent = ({ orderId, event, payment, onClose, onEventAdded, onPaymentAdded }) => {
  const [activeTab, setActiveTab] = useState(event ? 'event' : payment ? 'payment' : 'event');
  const [eventType, setEventType] = useState('');
  const [eventAmount, setEventAmount] = useState('');
  const [eventDocument, setEventDocument] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentType, setPaymentType] = useState('partial');
  const [paymentDocument, setPaymentDocument] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Event type options from backend EVENT_TYPE_CHOICES
  const eventTypeOptions = [
    { value: 'payment', label: 'Pago / Abono' },
    { value: 'payment_50_confirmed', label: '50% Pago Recibido' },
    { value: 'payment_100_confirmed', label: '100% Pago Recibido' },
    { value: 'design_approved', label: 'Diseño Aprobado' },
    { value: 'delivered', label: 'Entregado' },
  ];

  // Payment type options from backend
  const paymentTypeOptions = [
    { value: 'partial', label: 'Parcial' },
    { value: 'full', label: 'Completo' },
  ];

  useEffect(() => {
    setError(null);
    setSuccess(null);
    if (event) {
      // Editing an event
      setActiveTab('event');
      setEventType(event.event_type || '');
      setEventAmount(event.amount ? event.amount.toString() : '');
      setEventDocument(null);
    } else if (payment) {
      // Editing a payment
      setActiveTab('payment');
      setPaymentAmount(payment.amount ? payment.amount.toString() : '');
      setPaymentDate(payment.payment_date || '');
      setPaymentType(payment.payment_type || 'partial');
      setPaymentDocument(null);
    } else {
      // Creating new
      setActiveTab('event');
      setEventType('');
      setEventAmount('');
      setEventDocument(null);
      setPaymentAmount('');
      setPaymentDate('');
      setPaymentType('partial');
      setPaymentDocument(null);
    }
  }, [event, payment]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!eventType) {
      setError('El tipo de evento es obligatorio.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('event_type', eventType);
    if (eventType === 'payment') {
      if (!eventAmount || parseFloat(eventAmount) <= 0) {
        setError('El monto es obligatorio y debe ser mayor a 0 para eventos de tipo pago.');
        setLoading(false);
        return;
      }
      formData.append('amount', eventAmount);
    } else {
      formData.append('amount', '0');
    }
    if (eventDocument) {
      formData.append('document', eventDocument);
    }

    try {
      if (event) {
        await ApiService.updateOrderEvent(orderId, event.id, formData, token);
        setSuccess('Evento actualizado correctamente.');
      } else {
        await ApiService.addOrderEvent(orderId, formData, token);
        setSuccess('Evento registrado correctamente.');
      }
      onEventAdded();
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(`Error ${event ? 'updating' : 'adding'} event:`, error);
      const errorDetail = error.response?.data?.error || error.response?.data?.detail || `Error al ${event ? 'actualizar' : 'agregar'} el evento.`;
      setError(errorDetail);
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('El monto del pago debe ser mayor a 0.');
      setLoading(false);
      return;
    }
    if (!paymentDate) {
      setError('La fecha de pago es obligatoria.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('amount', paymentAmount);
    formData.append('payment_date', paymentDate);
    formData.append('payment_type', paymentType);
    if (paymentDocument) {
      formData.append('reference_document', paymentDocument);
    }

    try {
      if (payment) {
        await ApiService.updatePayment(payment.id, formData, token);
        setSuccess('Pago actualizado correctamente.');
      } else {
        await ApiService.addPaymentToOrder(orderId, formData, token);
        setSuccess('Pago registrado correctamente.');
      }
      onPaymentAdded();
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(`Error ${payment ? 'updating' : 'adding'} payment:`, error);
      const errorDetail = error.response?.data?.error || error.response?.data?.detail || `Error al ${payment ? 'actualizar' : 'agregar'} el pago.`;
      setError(errorDetail);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar este ${event ? 'evento' : 'pago'}?`)) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (event) {
        await ApiService.deleteOrderEvent(orderId, event.id, token);
        setSuccess('Evento eliminado correctamente.');
      } else if (payment) {
        await ApiService.deletePayment(payment.id, token);
        setSuccess('Pago eliminado correctamente.');
      }
      (event ? onEventAdded : onPaymentAdded)();
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error(`Error deleting ${event ? 'event' : 'payment'}:`, error);
      const errorDetail = error.response?.data?.error || error.response?.data?.detail || `Error al eliminar el ${event ? 'evento' : 'pago'}.`;
      setError(errorDetail);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {event ? 'Editar Evento' : payment ? 'Editar Pago' : 'Agregar Evento o Pago'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'event' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-l-lg`}
            onClick={() => setActiveTab('event')}
            disabled={payment}
          >
            Evento
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${activeTab === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'} rounded-r-lg`}
            onClick={() => setActiveTab('payment')}
            disabled={event}
          >
            Pago
          </button>
        </div>

        {success && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-4 animate-pulse">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}

        {activeTab === 'event' ? (
          <form onSubmit={handleEventSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Tipo de Evento</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                required
              >
                <option value="">Seleccione un evento</option>
                {eventTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {eventType === 'payment' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300">Monto</label>
                <input
                  type="number"
                  step="0.01"
                  value={eventAmount}
                  onChange={(e) => setEventAmount(e.target.value)}
                  className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                  placeholder="Ej. 100.00"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Documento</label>
              <input
                type="file"
                onChange={(e) => setEventDocument(e.target.files[0])}
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                accept="image/jpeg,image/png,application/pdf"
              />
              {event?.document && !eventDocument && (
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
            <div className="flex justify-between">
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} rounded-lg`}
                >
                  <FaTrash className="mr-2" /> Eliminar Evento
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg`}
              >
                <FaSave className="mr-2" /> {event ? 'Actualizar Evento' : 'Agregar Evento'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Monto</label>
              <input
                type="number"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                placeholder="Ej. 100.00"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Fecha de Pago</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Tipo de Pago</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                required
              >
                {paymentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300">Documento de Referencia</label>
              <input
                type="file"
                onChange={(e) => setPaymentDocument(e.target.files[0])}
                className="w-full p-2 mt-1 bg-gray-700 text-white rounded"
                accept="image/jpeg,image/png,application/pdf"
              />
              {payment?.reference_document && !paymentDocument && (
                <div className="mt-2">
                  {payment.reference_document.endsWith('.pdf') ? (
                    <a
                      href={payment.reference_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300"
                    >
                      <FaFileAlt className="mr-2" /> Ver Documento Actual
                    </a>
                  ) : (
                    <img
                      src={payment.reference_document}
                      alt="Documento actual"
                      className="h-24 w-24 object-cover rounded-lg shadow"
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between">
              {payment && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} rounded-lg`}
                >
                  <FaTrash className="mr-2" /> Eliminar Pago
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center px-4 py-2 ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-lg`}
              >
                <FaSave className="mr-2" /> {payment ? 'Actualizar Pago' : 'Agregar Pago'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEvent;