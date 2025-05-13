import React from "react";

const TeamMembersTable = ({ teamMembers, isMobile }) => {
  if (!teamMembers?.length) return null;

  return (
    <div className="card">
      <h2 className="section-header">Miembros del Equipo</h2>
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table className="custom-table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre y Posición</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id}>
                <td style={{ textAlign: "center" }}>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`Foto de ${member.name}`}
                      style={{
                        width: isMobile ? "50px" : "70px",
                        height: isMobile ? "50px" : "70px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e0e0e0",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#666",
                        fontStyle: "italic",
                        fontSize: "0.9em",
                      }}
                    >
                      Sin foto
                    </span>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  <strong style={{ fontSize: "1.1em", color: "#333" }}>
                    {member.name}
                  </strong>
                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#666",
                      fontSize: "0.9em",
                    }}
                  >
                    {member.position}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersTable;