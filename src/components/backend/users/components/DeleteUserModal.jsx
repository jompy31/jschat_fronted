import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteUserModal = ({ showDeleteConfirmation, setShowDeleteConfirmation, confirmDeleteUser }) => {
  return (
    <Modal
      show={showDeleteConfirmation}
      onHide={() => setShowDeleteConfirmation(false)}
      centered
      dialogClassName="custom-modal-zindex"
    >
      <Modal.Header closeButton className="bg-gradient-to-r from-red-600 to-red-500 text-white">
        <Modal.Title>Eliminar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <p className="text-gray-700">¿Estás seguro de que deseas eliminar este usuario?</p>
      </Modal.Body>
      <Modal.Footer className="bg-gray-50">
        <Button
          variant="secondary"
          onClick={() => setShowDeleteConfirmation(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={confirmDeleteUser}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal;
