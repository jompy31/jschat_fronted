import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import JobDataService from "../../../services/employee";

const Skills = ({ token, currentUser }) => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]); // Estado para los resultados filtrados
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Mostrar 5 elementos por página
  const [searchQuery, setSearchQuery] = useState("");

  const [currentSkill, setCurrentSkill] = useState(null);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadSkills();
  }, [currentUser]);

  useEffect(() => {
    handleSearch();
  }, [skills, searchQuery]);

  const loadSkills = () => {
    JobDataService.getAllSkills(token)
      .then((response) => {
        setSkills(response.data);
      })
      .catch((error) => console.error(error));
  };

  const deleteSkill = (skillId) => {
    JobDataService.deleteSkill(skillId, token)
      .then(() => {
        loadSkills();
      })
      .catch((error) => console.error(error));
  };

  const handleSaveSkill = (skill) => {
    const formData = new FormData();
    formData.append("name", skill.name);
    formData.append("description", skill.description);

    JobDataService.createSkill(formData, token)
      .then(() => {
        loadSkills();
        handleCloseModal();
      })
      .catch((error) => console.error("Error al crear habilidad", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && description) {
      handleSaveSkill({ id: currentSkill ? currentSkill.id : null, name, description });
    }
  };

  const handleCloseModal = () => {
    setShowSkillModal(false);
    setCurrentSkill(null);
    setName('');
    setDescription('');
  };

  const handleSearch = () => {
    const filtered = skills.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSkills(filtered);
    setCurrentPage(1); // Reiniciar a la página 1 después de la búsqueda
  };

  // Calcular los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSkills.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredSkills.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2>Habilidades</h2>

      {/* Buscar habilidades */}
      <Form.Control
        type="text"
        placeholder="Buscar por nombre o descripción..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          borderRadius: '5px',
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          transition: 'box-shadow 0.3s',
          outline: 'none',
          padding: '6px',
          width: '30%',
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0 0 6px rgba(0, 0, 255, 0.5)';
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        }}
      />

      <Button variant="primary" onClick={() => setShowSkillModal(true)} style={{ marginBottom: '10px' }}>
        Crear Habilidad
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ color: 'blue' }}>Nombre</th>
            <th style={{ color: 'blue' }}>Descripción</th>
            <th style={{ color: 'blue' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((skill) => (
            <tr key={skill.id}>
              <td>{skill.name}</td>
              <td>{skill.description}</td>
              <td>
                <Button variant="danger" onClick={() => deleteSkill(skill.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <span>
          Página {currentPage} de {Math.ceil(filteredSkills.length / itemsPerPage)}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(filteredSkills.length / itemsPerPage)}
        >
          Siguiente
        </Button>
      </div>

      {/* Modal para crear/editar habilidades */}
      <Modal show={showSkillModal} onHide={handleCloseModal} backdrop="true" keyboard={true}>
       
          <Modal.Title>{currentSkill ? "Editar Habilidad" : "Crear Habilidad"}</Modal.Title>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSkillName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSkillDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Skills;
