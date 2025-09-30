import React from "react";

const EditProfileModal = ({
  editedUser,
  handleEditUserChange,
  handleImageChange,
  handleEditUser,
  toggleModal,
  imagePreview,
  profile_picture,
  isLoading,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditUser(editedUser, profile_picture);
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
            <label>Correo electrónico:</label>
            <input
              type="email"
              name="email"
              value={editedUser.email || ""}
              onChange={handleEditUserChange}
              required
              className="form-input"
            />
          </div>
          {/* <div className="form-group">
            <label>Tipo de usuario:</label>
            <select
              name="userprofile.staff_status"
              value={editedUser.userprofile?.staff_status || "customer"}
              onChange={handleEditUserChange}
              className="form-input"
            >
              <option value="customer">Cliente</option>
              <option value="administrator">Administrador</option>
              <option value="sales">Ventas</option>
              <option value="design">Diseño</option>
            </select>
          </div> */}
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              name="userprofile.phone_number"
              value={editedUser.userprofile?.phone_number || ""}
              onChange={handleEditUserChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input
              type="text"
              name="userprofile.address"
              value={editedUser.userprofile?.address || ""}
              onChange={handleEditUserChange}
              className="form-input"
            />
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
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;