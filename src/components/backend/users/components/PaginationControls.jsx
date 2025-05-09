import React from 'react';

const PaginationControls = ({ currentPage, storedData, usersPerPage, handlePageChange }) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-4">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Anterior
      </button>
      <span className="text-gray-700 font-medium">Página {currentPage}</span>
      <button
        disabled={currentPage === Math.ceil(storedData.length / usersPerPage)}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Siguiente
      </button>
    </div>
  );
};

export default PaginationControls;