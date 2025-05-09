import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Register from '../register';

const AddUserModal = ({ showAddUserModal, setShowAddUserModal, newUser, setNewUser, handleSaveNewUser }) => {
  return (
    <Modal show={showAddUserModal} onHide={() => setShowAddUserModal(false)} centered>
      <Modal.Header closeButton className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <Modal.Title>Agregar usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <Register newUser={newUser} setNewUser={setNewUser} />
      </Modal.Body>
      <Modal.Footer className="bg-gray-50">
        <Button
          variant="secondary"
          onClick={() => setShowAddUserModal(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveNewUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Guardar Usuario
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;