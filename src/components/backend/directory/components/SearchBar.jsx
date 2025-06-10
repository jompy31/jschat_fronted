import React from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";

const SearchBar = ({ searchTerm, setSearchTerm, isSearching, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative w-1/3 flex items-center">
      <input
        type="text"
        placeholder="Buscar cliente en Directorio..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        disabled={isSearching}
      />
      {isSearching ? (
        <FaSpinner className="absolute right-12 top-3 text-gray-400 animate-spin" />
      ) : (
        <button
          onClick={onSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
          disabled={isSearching}
        >
          <FaSearch />
        </button>
      )}
    </div>
  );
};

export default SearchBar;