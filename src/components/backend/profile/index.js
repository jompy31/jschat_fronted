import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ProfileInfo from "./components/ProfileInfo";
import WorkExperience from "./components/WorkExperience";
import Skills from "./components/Skills";
import EditProfileModal from "./components/EditProfileModal";
import CreateSkillModal from "./components/CreateSkillModal";
import CreateExperienceModal from "./components/CreateExperienceModal";
import { fetchUser, fetchWorkExperience, fetchSkills, updateUser, createSkill, createWorkExperience, deleteSkill, deleteWorkExperience } from "./utils/apiService";
import { downloadPDF } from "./utils/pdfUtils";
import "./profile.css";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [workExperience, setWorkExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [profile_picture, setProfile_picture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userList, setUserList] = useState([]);
  const token = useSelector((state) => state.authentication.token);
  const componentRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      setEditedUser({
        ...user,
        user_summary: user.user_summary || "",
      });
      fetchWorkExperience(user.id, token).then(setWorkExperience);
      fetchSkills(user.id, token).then(setSkills);
    }
  }, []);

  const handleFetchUser = (userId) => {
    fetchUser(userId, token).then((updatedUser) => {
      setCurrentUser(updatedUser);
      setUserList(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    });
  };

  const handleEditUser = (formData) => {
    updateUser(currentUser.id, formData, token).then(() => {
      const newUser = { ...currentUser, ...formData };
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      setCurrentUser(newUser);
      setIsModalOpen(false);
      setImagePreview(null);
      handleFetchUser(currentUser.id);
    });
  };

  const handleCreateSkill = (skillData) => {
    createSkill(skillData, token).then(() => {
      fetchSkills(currentUser.id, token).then(setSkills);
      setIsModalOpen1(false);
    });
  };

  const handleCreateExperience = (experienceData) => {
    createWorkExperience(experienceData, token).then(() => {
      fetchWorkExperience(currentUser.id, token).then(setWorkExperience);
      setIsExperienceModalOpen(false);
    });
  };

  const handleDeleteSkill = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) {
      deleteSkill(id, token).then(() => {
        setSkills(skills.filter((skill) => skill.id !== id));
      });
    }
  };

  const handleDeleteExperience = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta experiencia laboral?")) {
      deleteWorkExperience(id, token).then(() => {
        setWorkExperience(workExperience.filter((experience) => experience.id !== id));
      });
    }
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
          <div style={{ width: "50%", padding: "10px" }}>
            <WorkExperience
              workExperience={workExperience}
              selectedExperience={selectedExperience}
              handleExperienceChange={(e) => {
                const experienceId = e.target.value;
                if (e.target.checked) {
                  setSelectedExperience([...selectedExperience, experienceId]);
                } else {
                  setSelectedExperience(selectedExperience.filter((id) => id !== experienceId));
                }
              }}
              handleDeleteExperience={handleDeleteExperience}
              toggleExperienceModal={() => setIsExperienceModalOpen(!isExperienceModalOpen)}
            />
            <Skills
              skills={skills}
              selectedSkills={selectedSkills}
              handleSkillChange={(e) => {
                const skillId = e.target.value;
                if (e.target.checked) {
                  setSelectedSkills([...selectedSkills, skillId]);
                } else {
                  setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
                }
              }}
              handleDeleteSkill={handleDeleteSkill}
              toggleSkillModal={() => setIsModalOpen1(!isModalOpen1)}
            />
          </div>
        </div>
        {isModalOpen && (
          <EditProfileModal
            editedUser={editedUser}
            handleEditUserChange={(e) => {
              const { name, value } = e.target;
              const formattedValue = name === "openwork" ? value === "yes" : value;
              setEditedUser({ ...editedUser, [name]: formattedValue });
            }}
            handleImageChange={(e) => {
              const file = e.target.files[0];
              setProfile_picture(file);
              setImagePreview(URL.createObjectURL(file));
            }}
            handleEditUser={handleEditUser}
            toggleModal={() => setIsModalOpen(!isModalOpen)}
            imagePreview={imagePreview}
            profile_picture={profile_picture}
          />
        )}
        {isModalOpen1 && (
          <CreateSkillModal
            currentUser={currentUser}
            handleCreateSkill={handleCreateSkill}
            toggleSkillModal={() => setIsModalOpen1(!isModalOpen1)}
          />
        )}
        {isExperienceModalOpen && (
          <CreateExperienceModal
            currentUser={currentUser}
            handleCreateExperience={handleCreateExperience}
            toggleExperienceModal={() => setIsExperienceModalOpen(!isExperienceModalOpen)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;