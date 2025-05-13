import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-1/3">
      <input
        type="text"
        placeholder="Buscar cliente en Directorio..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <FaSearch className="absolute right-3 top-3 text-gray-400" />
    </div>
  );
};

export default SearchBar;