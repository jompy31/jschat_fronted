import React from "react";

const WorkExperience = ({
  workExperience,
  selectedExperience,
  handleExperienceChange,
  handleDeleteExperience,
  toggleExperienceModal,
}) => {
  const tableStyle = {
    width: "100%",
    border: "1px solid #ccc",
    color: "black",
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
      <h2>Experiencia Laboral</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}></th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Título del Trabajo
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Compañía
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Fecha de Inicio
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Fecha de Fin
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Responsabilidades
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ccc", color: "black" }}>
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {workExperience.length > 0 ? (
            workExperience.map((experience) => (
              <tr key={experience.id}>
                <td>
                  <input
                    type="checkbox"
                    value={experience.id}
                    onChange={handleExperienceChange}
                    checked={selectedExperience.includes(experience.id)}
                  />
                </td>
                <td>{experience.job_title}</td>
                <td>{experience.company_name}</td>
                <td>{experience.start_date}</td>
                <td>{experience.end_date}</td>
                <td>{experience.responsibilities}</td>
                <td>
                  <button onClick={() => handleDeleteExperience(experience.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay experiencia laboral disponible.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button style={buttonStyle} onClick={toggleExperienceModal}>
        Crear Experiencia
      </button>
    </>
  );
};

export default WorkExperience;