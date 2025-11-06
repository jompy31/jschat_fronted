// frontend_github\jschat_fronted\src\components\backend\profile\components\EditProfileModal.js

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={toggleModal}
      />

      {/* MODAL CONTENT */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Editar Mi Perfil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NOMBRE Y APELLIDO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={editedUser.first_name || ""}
                onChange={handleEditUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={editedUser.last_name || ""}
                onChange={handleEditUserChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* CORREO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={editedUser.email || ""}
              onChange={handleEditUserChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña <span className="text-xs text-gray-500">(opcional)</span>
            </label>
            <input
              type="password"
              name="password"
              value={editedUser.password || ""}
              onChange={handleEditUserChange}
              placeholder="Dejar vacío para no cambiar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres. Déjalo vacío si no deseas cambiarla.
            </p>
          </div>

          {/* ROL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              name="userprofile.staff_status"
              value={editedUser.userprofile?.staff_status || "customer"}
              onChange={handleEditUserChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="customer">Cliente</option>
              <option value="administrator">Administrador</option>
              <option value="sales">Ventas</option>
              <option value="design">Diseño</option>
            </select>
          </div>

          {/* TELÉFONO Y DIRECCIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="userprofile.phone_number"
                value={editedUser.userprofile?.phone_number || ""}
                onChange={handleEditUserChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="userprofile.address"
                value={editedUser.userprofile?.address || ""}
                onChange={handleEditUserChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* FOTO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto de perfil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imagePreview && (
              <div className="mt-4 text-center">
                <img
                  src={imagePreview}
                  alt="Previsualización"
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-500 shadow-md"
                />
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={toggleModal}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition font-medium"
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;