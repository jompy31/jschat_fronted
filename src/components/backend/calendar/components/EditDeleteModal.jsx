import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import moment from 'moment';
import { deleteEvent } from '../utils/eventUtils';
import { downloadEvent, sendEmail } from '../utils/icsUtils';

const EditDeleteModal = ({
  show,
  handleClose,
  selectedEvent,
  setEventos,
  token,
  currentUser,
  email,
  setEmail,
  emailMessage,
  setEmailMessage,
}) => {
  const handleDeleteEvent = () => {
    deleteEvent(selectedEvent.id, token, setEventos, handleClose);
  };

  const handleDownloadEvent = () => {
    downloadEvent(selectedEvent);
  };

  const handleSendEmail = () => {
    sendEmail(selectedEvent, email, emailMessage);
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-zindex">
      <Modal.Header className="bg-blue-600 text-white rounded-t-lg">
        <Modal.Title>Detalles del Evento</Modal.Title>
        <button
          type="button"
          className="text-white hover:text-gray-200 text-xl"
          onClick={handleClose}
        >
          &times;
        </button>
      </Modal.Header>
      <Modal.Body className="bg-white rounded-b-lg p-6">
        {selectedEvent && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">{selectedEvent.title}</h4>
            <p className="text-gray-600">{selectedEvent.memo}</p>
            {selectedEvent.start ? (
              <p className="text-sm text-gray-500">
                Fechas de Calendario {moment(selectedEvent.start).format('YYYY-MM-DD HH:mm')}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Fecha: {moment(selectedEvent.created).format('YYYY-MM-DD HH:mm')}
              </p>
            )}
            <Form.Group>
              <Form.Label className="font-semibold text-gray-700">Correo Electrónico</Form.Label>
              <FormControl
                type="email"
                placeholder="Ingrese el correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="font-semibold text-gray-700">Mensaje</Form.Label>
              <FormControl
                as="textarea"
                rows={3}
                placeholder="Ingrese el mensaje"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Group>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleSendEmail}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
              >
                Enviar Correo Electrónico
              </Button>
              {currentUser && currentUser.staff_status === 'administrator' && (
                <Button
                  onClick={handleDeleteEvent}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition"
                >
                  Eliminar
                </Button>
              )}
              <Button
                onClick={handleDownloadEvent}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
              >
                Descargar Evento
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditDeleteModal;