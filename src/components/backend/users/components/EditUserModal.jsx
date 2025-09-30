import React from 'react';
import { FaUserEdit } from 'react-icons/fa';

const EditUserModal = ({ showModal, setShowModal, updatedUser, setUpdatedUser, handleSaveUser }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaUserEdit className="text-blue-500 text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>
        </div>

        {/* Body */}
        <div className="mb-6 space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={updatedUser.first_name}
              onChange={(e) => setUpdatedUser({ ...updatedUser, first_name: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el nombre"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-medium">Apellido</label>
            <input
              type="text"
              value={updatedUser.last_name}
              onChange={(e) => setUpdatedUser({ ...updatedUser, last_name: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el apellido"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-medium">Correo</label>
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el correo"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-medium">Rol</label>
            <select
              value={updatedUser.userprofile.staff_status}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userprofile: { ...updatedUser.userprofile, staff_status: e.target.value }
                })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="administrator">Administrator</option>
              <option value="sales">Sales</option>
              <option value="design">Design</option>
            </select>
          </div>
          <div>
            <label className="text-gray-600 text-sm font-medium">Teléfono</label>
            <input
              type="text"
              value={updatedUser.userprofile.phone_number}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userprofile: { ...updatedUser.userprofile, phone_number: e.target.value }
                })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese el teléfono"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-medium">Dirección</label>
            <input
              type="text"
              value={updatedUser.userprofile.address}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userprofile: { ...updatedUser.userprofile, address: e.target.value }
                })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingrese la dirección"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;