import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const JobTagModal = ({ show, handleClose, jobTag, handleSave }) => {
  const [name, setName] = useState(jobTag ? jobTag.name : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave({ id: jobTag ? jobTag.id : null, name });
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {jobTag ? 'Editar Etiqueta de Trabajo' : 'Crear Etiqueta de Trabajo'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formJobTagName">
            <Form.Label className="text-sm font-medium text-gray-700">Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default JobTagModal;