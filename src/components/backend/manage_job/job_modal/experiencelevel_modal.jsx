import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const ExperienceLevelModal = ({ show, handleClose, experienceLevel, handleSave }) => {
  const [level, setLevel] = useState(experienceLevel ? experienceLevel.level : '');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true); // Disable further submissions

    try {
      await handleSave({ id: experienceLevel ? experienceLevel.id : null, level });
      handleClose();
    } catch (error) {
      console.error('Error saving experience level:', error);
    } finally {
      setIsSubmitting(false); // Re-enable submission after completion
    }
  };

  const experienceLevels = [
    'Entry-level',
    'Mid-level',
    'Senior-level',
    'Director',
    'Executive',
  ];

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {experienceLevel ? 'Editar Nivel de Experiencia' : 'Crear Nivel de Experiencia'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formExperienceLevel">
            <Form.Label className="text-sm font-medium text-gray-700">Nivel</Form.Label>
            <Form.Control
              as="select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting} // Disable input during submission
            >
              <option value="">Seleccionar nivel</option>
              {experienceLevels.map((expLevel) => (
                <option key={expLevel} value={expLevel}>
                  {expLevel}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              disabled={isSubmitting} // Disable button during submission
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={isSubmitting} // Disable button during submission
            >
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ExperienceLevelModal;