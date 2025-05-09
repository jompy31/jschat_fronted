import React from "react";

const CreateSkillModal = ({ currentUser, handleCreateSkill, toggleSkillModal }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const skillData = {
      user: currentUser.id,
      name: e.target.skillName.value,
    };
    handleCreateSkill(skillData);
  };

  return (
    <div className="modal">
      <div
        className="modal-content"
        style={{
          overflowY: "auto",
          width: "50%",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#ffffff",
        }}
      >
        <span
          className="close"
          onClick={toggleSkillModal}
          style={{ cursor: "pointer", fontSize: "24px", color: "#888", float: "right" }}
        >
          ×
        </span>
        <h2 style={{ textAlign: "center", color: "#333" }}>
          Ingresar profesión que puede desarrollar
        </h2>
        <form
          onSubmit={handleSubmit}
          className="edit-profile-form"
          style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
        >
          <label style={{ marginBottom: "10px", color: "#555", fontWeight: "bold" }}>
            Nombre de la Profesión:
            <input
              type="text"
              name="skillName"
              required
              style={{
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "100%",
              }}
            />
          </label>
          <button type="submit" className="submit-button">
            Guardar profesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSkillModal;