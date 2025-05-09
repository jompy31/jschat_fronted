import React from "react";

const CreateExperienceModal = ({ currentUser, handleCreateExperience, toggleExperienceModal }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const experienceData = {
      user: currentUser.id,
      job_title: e.target.experienceTitle.value,
      company_name: e.target.experienceCompany.value,
      start_date: e.target.startDate.value,
      end_date: e.target.endDate.value,
      responsibilities: e.target.responsability.value,
    };
    handleCreateExperience(experienceData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={toggleExperienceModal}>
          ×
        </span>
        <h2>Crear Experiencia Laboral</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Título del Trabajo:</label>
            <input type="text" name="experienceTitle" className="form-input" required />
          </div>
          <div className="form-group">
            <label>Compañía:</label>
            <input type="text" name="experienceCompany" className="form-input" required />
          </div>
          <div className="form-group">
            <label>Responsabilidades:</label>
            <textarea name="responsability" className="form-textarea" rows="4" required />
          </div>
          <div className="form-group">
            <label>Fecha de Inicio:</label>
            <input type="date" name="startDate" className="form-input" required />
          </div>
          <div className="form-group">
            <label>Fecha de Fin:</label>
            <input type="date" name="endDate" className="form-input" />
          </div>
          <button type="submit" className="submit-button">
            Guardar Experiencia
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateExperienceModal;