import axios from 'axios';
import config from '../config/enviroments.ts';

class AffiliatedStoreDataService {
  // Obtener todas las propiedades
  getAllProperties(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/affiliated_stores/properties/`);  // Asegúrate de que la URL sea la correcta
  }

  // Obtener una propiedad por ID
  getPropertyById(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/affiliated_stores/properties/${id}/`);
  }

  // Crear una nueva propiedad
  createProperty(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post("${config.API_URL}/affiliated_stores/properties/", data);
  }

  // Actualizar una propiedad existente
  updateProperty(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/affiliated_stores/properties/${id}/`, data);
  }

  // Eliminar una propiedad
  deleteProperty(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/affiliated_stores/properties/${id}/`);
  }

  // Obtener todas las reseñas
  getAllReviews(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/affiliated_stores/reviews/`);
  }

  // Obtener una reseña por ID
  getReviewById(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/affiliated_stores/reviews/${id}/`);
  }

  // Crear una nueva reseña
  createReview(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post("${config.API_URL}/affiliated_stores/reviews/", data);
  }

  // Actualizar una reseña existente
  updateReview(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/affiliated_stores/reviews/${id}/`, data);
  }

  // Eliminar una reseña
  deleteReview(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/affiliated_stores/reviews/${id}/`);
  }
}

export default new AffiliatedStoreDataService();
