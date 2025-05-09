import React from "react";
import {
  getCompanyNameById,
  getExperienceLevelNameById,
  getSkillsByIds,
  getEmploymentType,
} from "../utils/formatters";

const JobCard = ({ job, companies, experienceLevels, skills, handleShowModal }) => {
  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: "15px",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "auto",
        transition: "transform 0.3s ease-in-out",
        zIndex: 1,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h4
        style={{
          fontWeight: "bold",
          fontSize: "1.0em",
          marginBottom: "15px",
          color: "#333",
          textAlign: "center",
          wordWrap: "break-word",
        }}
      >
        {job.title}
      </h4>
      <div style={{ textAlign: "left", fontSize: "0.8em", lineHeight: "1.5" }}>
        <strong>Empresa:</strong> {getCompanyNameById(job.company, companies)}
      </div>
      <div style={{ textAlign: "left", fontSize: "0.8em", lineHeight: "1.5" }}>
        <strong>Ubicación:</strong> {`${job.city}, ${job.country}`}
      </div>
      <div style={{ textAlign: "left", fontSize: "0.8em", lineHeight: "1.5" }}>
        <strong>Modalidad:</strong> {job.modality}
      </div>
      <div style={{ textAlign: "left", fontSize: "0.8em", lineHeight: "1.5" }}>
        <strong>Tipo de empleo:</strong> {getEmploymentType(job.employment_type)}
      </div>
      <div style={{ textAlign: "left", fontSize: "0.8em", lineHeight: "1.5" }}>
        <strong>Nivel de experiencia:</strong>{" "}
        {getExperienceLevelNameById(job.experience_level, experienceLevels)}
      </div>
      <div style={{ textAlign: "left", fontSize: "0.8em", lineHeight: "1.5" }}>
        <strong>Habilidades:</strong> {getSkillsByIds(job.skills_required || [], skills)}
      </div>
      <button
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          fontWeight: "bold",
          border: "1px solid #4CAF50",
          cursor: "pointer",
          borderRadius: "10px",
          textAlign: "center",
          transition: "background-color 0.3s, color 0.3s",
          width: "100%",
          padding:"10px",
          marginTop: "20px",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "black";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#4CAF50";
          e.target.style.color = "white";
        }}
        onClick={() => handleShowModal(job)}
      >
        Aplicar
      </button>
    </div>
  );
};

export default JobCard;