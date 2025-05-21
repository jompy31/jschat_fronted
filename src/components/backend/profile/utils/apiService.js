import TodoDataService from "../../../../services/todos";

export const fetchUser = async (userId, token) => {
  try {
    const response = await TodoDataService.getUserDetails(userId, token);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const fetchWorkExperience = async (userId, token) => {
  try {
    const response = await TodoDataService.getAllWorkExperiences(token);
    // Filtrar experiencias por userId
    return response.data.results.filter(experience => experience.user === userId) || [];
  } catch (error) {
    console.error("Error fetching work experience:", error);
    return [];
  }
};

export const fetchSkills = async (userId, token) => {
  try {
    const response = await TodoDataService.getAllSkills(token);
    // Filtrar habilidades por userId
    return response.data.results.filter(skill => skill.user === userId) || [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
};
export const updateUser = async (userId, formData, token) => {
  try {
    await TodoDataService.updateUser(userId, formData, token);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
};

export const createSkill = async (skillData, token) => {
  try {
    await TodoDataService.createSkill(skillData, token);
  } catch (error) {
    console.error("Error al crear skill:", error);
    throw error;
  }
};

export const createWorkExperience = async (experienceData, token) => {
  try {
    await TodoDataService.createWorkExperience(experienceData, token);
  } catch (error) {
    console.error("Error al crear experiencia laboral:", error);
    throw error;
  }
};

export const deleteSkill = async (id, token) => {
  try {
    await TodoDataService.deleteSkill(id, token);
  } catch (error) {
    console.error("Error al eliminar la habilidad:", error);
    throw error;
  }
};

export const deleteWorkExperience = async (id, token) => {
  try {
    await TodoDataService.deleteWorkExperience(id, token);
  } catch (error) {
    console.error("Error al eliminar la experiencia laboral:", error);
    throw error;
  }
};