import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

const SkillModal = ({ show, handleClose, skill, handleSave }) => {
  const [name, setName] = useState(skill ? skill.name : '');
  const [description, setDescription] = useState(skill ? skill.description : '');

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setDescription(skill.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [skill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave({ id: skill ? skill.id : null, name, description });
    setName('');
    setDescription('');
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {skill ? 'Editar Habilidad' : 'Crear Habilidad'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formSkillName">
            <Form.Label className="text-sm font-medium text-gray-700">Nombre</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formSkillDescription">
            <Form.Label className="text-sm font-medium text-gray-700">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

export default SkillModal;