import React from "react";
import { Form } from "react-bootstrap";
import "../bolsaempleo.css";

const JobFilter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        marginLeft: "5.3%",
        marginTop: "20px",
      }}
    >
      <label htmlFor="search" style={{ marginRight: "10px", fontWeight: "bold" }}>
        Buscar por título, empresa:
      </label>
      <Form.Control
        id="search"
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        style={{ width: "300px" }}
      />
    </div>
  );
};

export default JobFilter;
