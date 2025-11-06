// frontend_github\jschat_fronted\src\components\backend\profile\components\ProfileInfo.js

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../profile/components/profileinfo.css";

const ProfileInfo = ({ currentUser, toggleModal }) => {
  const token = useSelector((state) => state.authentication.token);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (currentUser?.userprofile?.profile_picture) {
      const url = currentUser.userprofile.profile_picture;

      // Si ya es una URL absoluta con http/https, usar con token
      if (url.startsWith('http')) {
        // Crear una URL con headers de autenticación
        fetch(url, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        })
          .then(res => res.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            setImageUrl(objectUrl);
            setImageError(false);
          })
          .catch(() => {
            setImageError(true);
          });
      } else {
        // Si es relativa, construir URL completa
        const fullUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${url}`;
        setImageUrl(fullUrl);
      }
    } else {
      setImageError(true);
    }
  }, [currentUser, token]);

  return (
    <div className="profile-info">
      {currentUser ? (
        <>
          {/* IMAGEN DE PERFIL */}
          <div className="profile-image-container mb-6">
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt="Foto de perfil"
                className="profile-image rounded-full object-cover border-4 border-blue-600 shadow-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="profile-image-fallback">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 flex items-center justify-center mx-auto">
                  <span className="text-gray-500 text-4xl font-bold">
                    {currentUser.first_name?.[0]?.toUpperCase()}
                    {currentUser.last_name?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button className="action-btn mb-6" onClick={toggleModal}>
            Editar datos del perfil
          </button>

          <table className="profile-table w-full">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-700">Nombre:</td>
                <td className="text-gray-900">{currentUser.first_name}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700">Apellido:</td>
                <td className="text-gray-900">{currentUser.last_name}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700">Correo electrónico:</td>
                <td className="text-gray-900 break-all">{currentUser.email}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700">Rol:</td>
                <td className="text-gray-900 capitalize">
                  {currentUser.userprofile?.staff_status || 'customer'}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700">Teléfono:</td>
                <td className="text-gray-900">
                  {currentUser.userprofile?.phone_number || 'No registrado'}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700">Dirección:</td>
                <td className="text-gray-900">
                  {currentUser.userprofile?.address || 'No registrada'}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-center text-gray-500">Cargando información del usuario...</p>
      )}
    </div>
  );
};

export default ProfileInfo;