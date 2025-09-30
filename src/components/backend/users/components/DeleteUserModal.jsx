import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const DeleteUserModal = ({ showDeleteConfirmation, setShowDeleteConfirmation, confirmDeleteUser }) => {
  if (!showDeleteConfirmation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">Confirmar Eliminación</h2>
        </div>

        {/* Body */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirmation(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDeleteUser}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;