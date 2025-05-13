import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const JobAlertModal = ({
  show,
  handleClose,
  jobAlert,
  jobCategories,
  experienceLevels,
  skills,
  handleSave,
}) => {
  const [alertText, setAlertText] = useState(jobAlert ? jobAlert.alertText : '');
  const [category, setCategory] = useState(jobAlert ? jobAlert.category : '');
  const [location, setLocation] = useState(jobAlert ? jobAlert.location : '');
  const [experienceLevel, setExperienceLevel] = useState(jobAlert ? jobAlert.experienceLevel : '');
  const [selectedSkills, setSelectedSkills] = useState(jobAlert ? jobAlert.skills_required : []);

  const handleMultiSelectChange = (e, setter) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0, len = options.length; i < len; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setter(selectedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave({
      keywords: alertText,
      category,
      location,
      experienceLevel,
      skills: selectedSkills,
    });
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {jobAlert ? 'Editar Alerta de Trabajo' : 'Crear Alerta de Trabajo'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formJobAlertText">
            <Form.Label className="text-sm font-medium text-gray-700">Texto de la Alerta</Form.Label>
            <Form.Control
              type="text"
              value={alertText}
              onChange={(e) => setAlertText(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobCategory">
            <Form.Label className="text-sm font-medium text-gray-700">Categoría</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {jobCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobLocation">
            <Form.Label className="text-sm font-medium text-gray-700">Ubicación</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobExperienceLevel">
            <Form.Label className="text-sm font-medium text-gray-700">Nivel de Experiencia</Form.Label>
            <Form.Control
              as="select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {experienceLevels.map((level) => (
                <option key={level.id} value={level.id}>{level.level}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobSkills">
            <Form.Label className="text-sm font-medium text-gray-700">Habilidades Requeridas</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={selectedSkills}
              onChange={(e) => handleMultiSelectChange(e, setSelectedSkills)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 max-h-32 overflow-y-auto"
            >
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
              ))}
            </Form.Control>
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

export default JobAlertModal;