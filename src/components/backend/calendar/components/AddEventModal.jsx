import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { saveEvent } from '../utils/eventUtils';

const AddEventModal = ({ show, handleClose, newEvent, setNewEvent, setEventos, token, isEditMode = false, selectedEvent }) => {
  const handleSaveEvent = () => {
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
    <>
      <div className="modal-backdrop" onClick={handleClose}></div>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEditMode ? 'Editar Evento' : 'Agregar Evento'}</h2>
          <button className="modal-close" onClick={handleClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              type="text"
              placeholder="Ingrese el título"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea
              rows={3}
              placeholder="Ingrese la descripción"
              value={newEvent.memo}
              onChange={(e) => setNewEvent({ ...newEvent, memo: e.target.value })}
              className="form-textarea"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fecha y Hora</label>
            <DatePicker
              selected={moment(newEvent.created).toDate()}
              onChange={(date) => setNewEvent({ ...newEvent, created: date })}
              showTimeSelect
              dateFormat="Pp"
              popperPlacement="auto"
              className="form-input"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleClose} className="btn btn-ghost">
            Cerrar
          </button>
          <button onClick={handleSaveEvent} className="btn btn-primary">
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddEventModal;