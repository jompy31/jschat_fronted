import React, { useState, useCallback } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Escriba el nombre del servicio que esta interesado"
        style={{
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          border: "1px solid black",
          padding: "10px 20px",
          cursor: "pointer",
          width: "50%",
          transition: "background-color 0.3s, color 0.3s",
          borderRadius: "10px",
          marginBottom: "2%",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          border: "1px solid black",
          padding: "10px 20px",
          cursor: "pointer",
          width: "50vh",
          transition: "background-color 0.3s, color 0.3s",
          borderRadius: "10px",
          marginBottom: "2%",
          lineHeight: "1.5",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "green";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.color = "black";
        }}
      >
        Presione para buscar
      </button>
    </>
  );
};

export default SearchBar;