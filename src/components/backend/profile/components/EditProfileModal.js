import React from "react";
import { formatUserData } from "../utils/formatUtils";

const EditProfileModal = ({
  editedUser,
  handleEditUserChange,
  handleImageChange,
  handleEditUser,
  toggleModal,
  imagePreview,
  profile_picture,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = formatUserData(editedUser, profile_picture);
    handleEditUser(formattedData);
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ overflowY: "auto", width: "50%" }}>
        <span className="close" onClick={toggleModal}>
          ×
        </span>
        <h2>Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="first_name"
              value={editedUser.first_name || ""}
              onChange={handleEditUserChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input
              type="text"
              name="last_name"
              value={editedUser.last_name || ""}
              onChange={handleEditUserChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="address"
              value={editedUser.address || ""}
              onChange={handleEditUserChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Fecha de nacimiento:</label>
            <input
              type="date"
              name="date_of_birth"
              value={editedUser.date_of_birth || ""}
              onChange={handleEditUserChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Número de teléfono:</label>
            <input
              type="text"
              name="phone_number"
              value={editedUser.phone_number || ""}
              onChange={handleEditUserChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Empresa:</label>
            <input
              type="text"
              name="company"
              value={editedUser.company || ""}
              onChange={handleEditUserChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Buscando trabajo?</label>
            <select
              name="openwork"
              value={editedUser.openwork ? "yes" : "no"}
              onChange={handleEditUserChange}
              className="form-input"
            >
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              Imagen de perfil:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Previsualización"
                className="image-preview"
              />
            )}
          </div>
          <div className="form-group">
            <label>Resumen de Usuario:</label>
            <textarea
              name="user_summary"
              value={editedUser.user_summary || ""}
              onChange={handleEditUserChange}
              rows="4"
              className="form-textarea"
            />
          </div>
          <button type="submit" className="submit-button">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;