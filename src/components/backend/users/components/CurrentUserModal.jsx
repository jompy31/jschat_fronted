import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CurrentUserModal = ({ showCurrentUserModal, setShowCurrentUserModal, currentUser }) => {
  return (
    <Modal show={showCurrentUserModal} onHide={() => setShowCurrentUserModal(false)} centered>
      <Modal.Header closeButton className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <Modal.Title>Usuario Actual</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        {currentUser && (
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Nombre:</span> {currentUser.first_name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Apellido:</span> {currentUser.last_name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Correo:</span> {currentUser.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Rol de página:</span> {currentUser.staff_status}
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-gray-50">
        <Button
          variant="primary"
          onClick={() => setShowCurrentUserModal(false)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CurrentUserModal;