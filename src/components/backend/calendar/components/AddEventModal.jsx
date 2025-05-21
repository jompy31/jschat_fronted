import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { saveEvent } from '../utils/eventUtils';

const AddEventModal = ({ show, handleClose, newEvent, setNewEvent, setEventos, token, isEditMode = false, selectedEvent }) => {
  const handleSaveEvent = () => {
    console.log('newEvent:', newEvent);
    console.log('selectedEvent:', selectedEvent);
    saveEvent(newEvent, isEditMode ? selectedEvent : null, token, setEventos, () => {
      setNewEvent({
        title: '',
        memo: '',
        created: new Date(),
        complete: false,
      });
      handleClose();
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">{isEditMode ? 'Editar Evento' : 'Agregar Evento'}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
            <input
              type="text"
              placeholder="Ingrese el título"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
            <textarea
              rows={3}
              placeholder="Ingrese la descripción"
              value={newEvent.memo}
              onChange={(e) => setNewEvent({ ...newEvent, memo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha y Hora</label>
            <DatePicker
              selected={moment(newEvent.created).toDate()}
              onChange={(date) => setNewEvent({ ...newEvent, created: date })}
              showTimeSelect
              dateFormat="Pp"
              popperPlacement="auto"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleSaveEvent}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;