import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ProfileInfo from "./components/ProfileInfo";
import EditProfileModal from "./components/EditProfileModal";
import { fetchUser, updateUser } from "./utils/apiService";
import { downloadPDF } from "./utils/pdfUtils";
import { formatUserData } from "./utils/formatUtils";
import "./profile.css";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({ userprofile: {} });
  const [profile_picture, setProfile_picture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.authentication.token);
  const componentRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setEditedUser({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        userprofile: {
          staff_status: user.userprofile?.staff_status || "customer",
          phone_number: user.userprofile?.phone_number || "",
          address: user.userprofile?.address || "",
        },
      });
    }
  }, []);

  const handleFetchUser = (userId) => {
    fetchUser(userId, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setEditedUser({
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          userprofile: {
            staff_status: updatedUser.userprofile?.staff_status || "customer",
            phone_number: updatedUser.userprofile?.phone_number || "",
            address: updatedUser.userprofile?.address || "",
          },
        });
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        alert("Error al cargar los datos del usuario. Intenta de nuevo.");
      });
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("userprofile.")) {
      const field = name.split(".")[1];
      setEditedUser({
        ...editedUser,
        userprofile: {
          ...editedUser.userprofile,
          [field]: value,
        },
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value,
      });
    }
  };

  const handleEditUser = (formData, profile_picture) => {
    setIsLoading(true);
    const formattedData = formatUserData(formData, profile_picture);
    updateUser(currentUser.id, formattedData, token)
      .then((updatedUser) => {
        handleFetchUser(currentUser.id); // Recarga los datos desde el servidor
        setIsModalOpen(false); // Cierra el modal solo si la actualización es exitosa
        setImagePreview(null);
        setProfile_picture(null);
        alert("Perfil actualizado correctamente.");
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        const errorMessage = error?.email
          ? "El correo electrónico ya está registrado."
          : error?.detail || "Error al actualizar el perfil. Verifica los datos e intenta de nuevo.";
        alert(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  };

  return (
    <div style={{ marginTop: "7%" }}>
      <div ref={componentRef} style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
        {currentUser && (
          <h2>
            Bienvenido, {currentUser.first_name} {currentUser.last_name}
          </h2>
        )}
        <button
          style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => downloadPDF(componentRef)}
        >
          Descargar componente como PDF
        </button>
        <div style={containerStyle}>
          <ProfileInfo
            currentUser={currentUser}
            toggleModal={() => setIsModalOpen(!isModalOpen)}
          />
        </div>
        {isModalOpen && (
          <EditProfileModal
            editedUser={editedUser}
            handleEditUserChange={handleEditUserChange}
            handleImageChange={(e) => {
              const file = e.target.files[0];
              setProfile_picture(file);
              setImagePreview(URL.createObjectURL(file));
            }}
            handleEditUser={handleEditUser}
            toggleModal={() => setIsModalOpen(!isModalOpen)}
            imagePreview={imagePreview}
            profile_picture={profile_picture}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;