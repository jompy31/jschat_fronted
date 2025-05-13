import React, { useState } from 'react';
import { renderPaginationButtons } from '../utils/pagination';

const TableComponent = ({ columns, data, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div className="mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm table-fixed">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[200px] truncate"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className="px-4 py-2 text-sm text-gray-600 text-left align-top w-[200px]"
                  >
                    <div className="max-h-40 overflow-y-auto">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Página Anterior
        </button>
        {renderPaginationButtons(currentPage, totalPages, setCurrentPage)}
        <button
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Página Siguiente
        </button>
      </div>
    </div>
  );
};

export default TableComponent;