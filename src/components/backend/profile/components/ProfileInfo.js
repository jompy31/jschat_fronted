import React from "react";
import  "../../profile/components/profileinfo.css"

const ProfileInfo = ({ currentUser, toggleModal }) => {
  return (
    <div className="profile-info">
      {currentUser ? (
        <>
          {currentUser.userprofile?.profile_picture && (
            <img
              src={currentUser.userprofile.profile_picture}
              alt="Perfil"
              className="profile-image"
            />
          )}
          <button className="action-btn" onClick={toggleModal}>
            Editar datos del perfil
          </button>
          <table className="profile-table">
            <tbody>
              <tr>
                <td className="font-semibold">Nombre:</td>
                <td>{currentUser.first_name}</td>
              </tr>
              <tr>
                <td className="font-semibold">Apellido:</td>
                <td>{currentUser.last_name}</td>
              </tr>
              <tr>
                <td className="font-semibold">Correo electrónico:</td>
                <td>{currentUser.email}</td>
              </tr>
              <tr>
                <td className="font-semibold">Tipo de usuario:</td>
                <td>{currentUser.userprofile?.staff_status}</td>
              </tr>
              <tr>
                <td className="font-semibold">Teléfono:</td>
                <td>{currentUser.userprofile?.phone_number}</td>
              </tr>
              <tr>
                <td className="font-semibold">Dirección:</td>
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
