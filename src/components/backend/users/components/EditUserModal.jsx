import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditUserModal = ({ showModal, setShowModal, updatedUser, setUpdatedUser, handleSaveUser }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      dialogClassName="custom-modal-zindex"
    >
      <Modal.Header closeButton className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <form className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              value={updatedUser.first_name}
              onChange={(e) => setUpdatedUser({ ...updatedUser, first_name: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              value={updatedUser.last_name}
              onChange={(e) => setUpdatedUser({ ...updatedUser, last_name: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={updatedUser.email}
              onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={updatedUser.password}
              onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
              placeholder="Dejar vacío si no desea cambiarla"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              Tipo de usuario
            </label>
            <select
              id="userType"
              value={updatedUser.staff_status}
              onChange={(e) => setUpdatedUser({ ...updatedUser, staff_status: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="customer">Cliente</option>
              <option value="user">Usuario</option>
              <option value="sales">Vendedor</option>
              <option value="design">Diseñador</option>
              <option value="administrator">Administrador</option>
            </select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="bg-gray-50">
        <Button
          variant="secondary"
          onClick={() => setShowModal(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Guardar cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
