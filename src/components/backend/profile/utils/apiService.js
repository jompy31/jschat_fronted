import TodoDataService from "../../../../services/todos";

export const fetchUser = async (userId, token) => {
  try {
    const response = await TodoDataService.getUserDetails(userId, token);
    return response.data;
  } catch (e) {
    console.error("Error fetching user:", e);
    throw e;
  }
};

export const updateUser = async (userId, formData, token) => {
  try {
    const response = await TodoDataService.updateUser(userId, formData, token);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error.response?.data || error.message);
    throw error.response?.data || error; // Propaga los detalles del error
  }
};