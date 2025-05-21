import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import { getAllSkills, createSkill, deleteSkill } from '../utils/api';
import { handleSearch, paginate } from '../utils/dataHandlers';

const Skills = ({ token }) => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadSkills();
  }, []);

  useEffect(() => {
    handleSearch(skills, searchQuery, ['name', 'description'], setFilteredSkills);
    setCurrentPage(1);
  }, [skills, searchQuery]);

  const loadSkills = async () => {
    try {
      const response = await getAllSkills(token);
      const skillsData = Array.isArray(response.data) ? response.data : [];
      setSkills(skillsData);
    } catch (error) {
      console.error('Error loading skills:', error);
      setSkills([]);
    }
  };

  const handleSaveSkill = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      await createSkill(formData, token);
      await loadSkills();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDeleteSkill = async (skill) => {
    try {
      await deleteSkill(skill.id, token);
      await loadSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleCloseModal = () => {
    setShowSkillModal(false);
    setName('');
    setDescription('');
  };

  const columns = [
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
  ];

  const actionButtons = [
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: handleDeleteSkill,
    },
  ];

  const { currentItems, totalPages } = paginate(filteredSkills, currentPage, itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Habilidades</h2>
        <Button
          onClick={() => setShowSkillModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Crear Habilidad
        </Button>
      </div>
      <Form.Control
        type="text"
        placeholder="Buscar por nombre o descripción..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3"
      />
      <DataTable
        columns={columns}
        data={currentItems}
        actionButtons={actionButtons}
      />
      <div className="flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Anterior
        </Button>
        <span className="text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Siguiente
        </Button>
      </div>
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showSkillModal ? 'block' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Crear Habilidad</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <Form onSubmit={(e) => { e.preventDefault(); handleSaveSkill(); }} className="space-y-4">
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
                onClick={handleCloseModal}
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
    </div>
  );
};

Skills.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Skills;