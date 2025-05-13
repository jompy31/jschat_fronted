import React, { useState } from "react";

const getPaginationBoundaries = (currentPage, itemsPerPage, totalItems) => {
    // Ensure totalItems is non-negative
    const safeTotalItems = Math.max(0, totalItems);
    const totalPages = Math.ceil(safeTotalItems / itemsPerPage) || 1; // At least 1 page if items exist
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
    return {
      indexOfFirstItem,
      indexOfLastItem,
      totalPages,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    };
  };

const PaginationControls = ({ currentPage, totalItems, itemsPerPage, setCurrentPage, loading }) => {
  const { totalPages, isFirstPage, isLastPage } = getPaginationBoundaries(
    currentPage,
    itemsPerPage,
    totalItems
  );
  const [pageInput, setPageInput] = useState(currentPage);

  const handlePageInput = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= totalPages)) {
      setPageInput(value);
    }
  };

  const handlePageJump = () => {
    if (pageInput && !loading) {
      const newPage = Number(pageInput);
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => !loading && setCurrentPage(i)}
          disabled={loading}
          className={`px-3 py-1 rounded ${
            currentPage === i && !loading ? "bg-blue-600 text-white" : "bg-gray-200"
          } disabled:opacity-50`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  // Always show pagination controls, even with no items
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={isFirstPage || loading}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Anterior
      </button>
      {renderPageButtons()}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={isLastPage || loading}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={pageInput}
          onChange={handlePageInput}
          disabled={loading}
          className="w-16 px-2 py-1 border rounded disabled:opacity-50"
          min="1"
          max={totalPages}
        />
        <button
          onClick={handlePageJump}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Ir
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;