import React from 'react';
import { FaSearch } from 'react-icons/fa';

const UserSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full md:w-1/3">
      <input
        type="text"
        placeholder="Buscar por nombre, correo o rol"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
};

export default UserSearch;