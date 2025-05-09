import React from "react";

const ProfileInfo = ({ currentUser, toggleModal }) => {
  const profileImageStyle = {
    width: "30%",
    height: "auto",
    borderRadius: "15px",
    border: "3px solid red",
    boxShadow: "0 0 10px black",
    marginBottom: "5px",
    marginLeft: "8%",
  };

  const columnStyle = {
    width: "50%",
    padding: "10px",
  };

  const tableStyle = {
    width: "100%",
    border: "1px solid #ccc",
    color: "black",
    borderCollapse: "collapse",
    marginTop: "10px",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  return (
    <div style={columnStyle}>
      {currentUser ? (
        <>
          {currentUser.profile_picture && (
            <img
              src={currentUser.profile_picture}
              alt="Perfil"
              style={profileImageStyle}
            />
          )}
          <button style={buttonStyle} onClick={toggleModal}>
            Editar datos del perfil
          </button>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Nombre:
                </td>
                <td>{currentUser.first_name}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Apellido:
                </td>
                <td>{currentUser.last_name}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Correo electrónico:
                </td>
                <td>{currentUser.email}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Tipo de Usuario:
                </td>
                <td>{currentUser.staff_status}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Buscando trabajo:
                </td>
                <td>{currentUser.openwork ? "Sí" : "No"}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Resumen de Usuario:
                </td>
                <td>{currentUser.bio}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Fecha de nacimiento:
                </td>
                <td>{currentUser.date_of_birth}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Dirección:
                </td>
                <td>{currentUser.address}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  País:
                </td>
                <td>{currentUser.country}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Número de teléfono:
                </td>
                <td>{currentUser.phone_number}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Empresa:
                </td>
                <td>{currentUser.company}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default ProfileInfo;