import React from "react";

const Skills = ({ skills, selectedSkills, handleSkillChange, handleDeleteSkill, toggleSkillModal }) => {
  const smallTableStyle = {
    width: "100%",
    border: "1px solid #ccc",
    borderCollapse: "collapse",
    marginTop: "10px",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <>
      <h2>Profesiones</h2>
      <table style={smallTableStyle}>
        <thead>
          <tr>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}></th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Habilidad
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {skills.length > 0 ? (
            skills.map((skill) => (
              <tr key={skill.id}>
                <td>
                  {/* <input
                    type="checkbox"
                    value={skill.id}
                    onChange={handleSkillChange}
                    checked={selectedSkills.includes(skill.id)}
                  /> */}
                </td>
                <td>{skill.name}</td>
                <td>
                  <button onClick={() => handleDeleteSkill(skill.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No se encontraron habilidades.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button style={buttonStyle} onClick={toggleSkillModal}>
        Crear Profesión
      </button>
    </>
  );
};

export default Skills;