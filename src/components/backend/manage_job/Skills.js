import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import SkillModal from "./job_modal/skill_model";
import JobDataService from "../../../services/employee";

const Skills = ({ token, currentUser }) => {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

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
      .catch((error) => console.error("Error loading skills:", error));
  };

  const deleteSkill = (skillId) => {
    JobDataService.deleteSkill(skillId, token)
      .then(() => {
        loadSkills();
      })
      .catch((error) => console.error("Error deleting skill:", error));
  };

  const handleSaveSkill = (skill) => {
    // Log the skill data in JSON format
    console.log("Skill in JSON format:", JSON.stringify(skill, null, 2));
  
    // Send JSON data to the API
    const skillData = {
      name: skill.name,
      description: skill.description || "", // Ensure description is a string, even if empty
    };
  
    console.log("Sending POST request to /api/skills/ with data:", skillData);
  
    JobDataService.createSkill(skillData, token)
      .then((response) => {
        console.log("Skill created successfully:", response.data);
        loadSkills();
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error creating skill:", {
          message: error.message,
          response: error.response ? error.response.data : null,
          status: error.response ? error.response.status : null,
        });
        // Display error to user
        alert(`Error creating skill: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
      });
  };
  const handleCloseModal = () => {
    setShowSkillModal(false);
    setCurrentSkill(null);
  };

  const handleSearch = () => {
    const filtered = skills.filter(skill =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSkills(filtered);
    setCurrentPage(1);
  };

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

      <Button
        variant="primary"
        onClick={() => setShowSkillModal(true)}
        style={{ marginBottom: '10px' }}
      >
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
                <Button
                  variant="danger"
                  onClick={() => deleteSkill(skill.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

      <SkillModal
        show={showSkillModal}
        handleClose={handleCloseModal}
        skill={currentSkill}
        handleSave={handleSaveSkill}
      />
    </div>
  );
};

export default Skills;