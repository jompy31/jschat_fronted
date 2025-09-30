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
          {currentUser.userprofile?.profile_picture && (
            <img
              src={currentUser.userprofile.profile_picture}
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
                  Tipo de usuario:
                </td>
                <td>{currentUser.userprofile?.staff_status}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Teléfono:
                </td>
                <td>{currentUser.userprofile?.phone_number}</td>
              </tr>
              <tr>
                <td className="font-semibold" style={{ paddingRight: "20px" }}>
                  Dirección:
                </td>
                <td>{currentUser.userprofile?.address}</td>
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