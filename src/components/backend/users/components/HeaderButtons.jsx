import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaDownload } from 'react-icons/fa';
import { convertToCSV } from '../utils/convertToCSV';

const HeaderButtons = ({ handleAddUser, userList }) => {
  const handleDownloadCSV = () => {
    const csvData = convertToCSV(userList);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userList.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex space-x-4">
      <Link
        to="/register"
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
      >
        <FaUserPlus className="mr-2" />
        Registrar
      </Link>
      <button
        onClick={handleDownloadCSV}
        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
      >
        <FaDownload className="mr-2" />
        Descargar lista
      </button>
    </div>
  );
};

export default HeaderButtons;