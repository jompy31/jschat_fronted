import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { saveEvent } from '../utils/eventUtils';

const AddEventModal = ({ show, handleClose, newEvent, setNewEvent, setEventos, token }) => {
  const handleSaveEvent = () => {
    saveEvent(newEvent, null, token, setEventos, () => {
      setNewEvent({
        title: '',
        memo: '',
        created: new Date(),
        complete: false,
      });
      handleClose();
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-zindex">
      <Modal.Header className="bg-blue-600 text-white rounded-t-lg">
        <Modal.Title>Agregar Evento</Modal.Title>
        <button
          type="button"
          className="text-white hover:text-gray-200 text-xl"
          onClick={handleClose}
        >
          &times;
        </button>
      </Modal.Header>
      <Modal.Body className="bg-white rounded-b-lg p-6">
        <Form className="space-y-4">
          <Form.Group>
            <Form.Label className="font-semibold text-gray-700">Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el título"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="font-semibold text-gray-700">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ingrese la descripción"
              value={newEvent.memo}
              onChange={(e) => setNewEvent({ ...newEvent, memo: e.target.value })}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="font-semibold text-gray-700">Fecha y Hora</Form.Label>
            <DatePicker
              selected={moment(newEvent.created).toDate()}
              onChange={(date) => setNewEvent({ ...newEvent, created: date })}
              showTimeSelect
              dateFormat="Pp"
              popperPlacement="auto"
              popperModifiers={[
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                  },
                },
              ]}
              className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition"
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEventModal;