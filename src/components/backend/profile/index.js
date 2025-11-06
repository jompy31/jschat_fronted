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
      // console.log(user)
      setEditedUser({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: '',
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

  if (name === 'password') {
    setEditedUser({ ...editedUser, password: value });
  } else if (name.startsWith("userprofile.")) {
    const field = name.split(".")[1];
    setEditedUser({
      ...editedUser,
      userprofile: { ...editedUser.userprofile, [field]: value },
    });
  } else {
    setEditedUser({ ...editedUser, [name]: value });
  }
};
  const handleEditUser = (formData, profile_picture) => {
  setIsLoading(true);

  const payload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    ...(formData.password && { password: formData.password }),
    userprofile: {
      staff_status: formData.userprofile.staff_status,
      phone_number: formData.userprofile.phone_number || '',
      address: formData.userprofile.address || '',
    },
  };

  // Si hay foto, usar FormData
  if (profile_picture) {
    const formDataObj = new FormData();
    Object.keys(payload).forEach(key => {
      if (key === 'userprofile') {
        Object.keys(payload.userprofile).forEach(subKey => {
          formDataObj.append(`userprofile.${subKey}`, payload.userprofile[subKey]);
        });
      } else {
        formDataObj.append(key, payload[key]);
      }
    });
    formDataObj.append('userprofile.profile_picture', profile_picture);

    updateUser(currentUser.id, formDataObj, token, true) // ← true = FormData
      .then(() => {
        handleFetchUser(currentUser.id);
        setIsModalOpen(false);
        setImagePreview(null);
        setProfile_picture(null);
        alert("Perfil actualizado correctamente.");
      })
      .catch((error) => {
        console.error(error);
        alert(error?.email?.[0] || "Error al actualizar perfil");
      })
      .finally(() => setIsLoading(false));
  } else {
    updateUser(currentUser.id, payload, token)
      .then(() => {
        handleFetchUser(currentUser.id);
        setIsModalOpen(false);
        alert("Perfil actualizado correctamente.");
      })
      .catch((error) => {
        console.error(error);
        alert(error?.email?.[0] || "Error al actualizar perfil");
      })
      .finally(() => setIsLoading(false));
  }
};

  return (
    <div className="profile-page">
      <div className="profile-container" ref={componentRef}>
        {currentUser && (
          <h2 className="profile-title">
            Bienvenido, {currentUser.first_name} {currentUser.last_name}
          </h2>
        )}
        <button
          className="action-btn"
          onClick={() => downloadPDF(componentRef)}
        >
          Descargar perfil como PDF
        </button>
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
  );
};

export default Profile;