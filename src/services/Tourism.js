import axios from "axios";
import config from "../config/enviroments.ts";

class TourismDataService {
  // Property Actions
  getAllProperties(token) {
    // axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    return axios.get(`${config.API_URL}/tourism/properties/`);
  }
  getAllPropertiesImages(token) {
    // axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    return axios.get(`${config.API_URL}/tourism/property-images/`);
  }

  createProperty(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/tourism/properties/`, data);
  }

  updateProperty(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/tourism/properties/${id}/`, data);
  }

  deleteProperty(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/tourism/properties/${id}/`);
  }

  // Booking Actions
  getAllBookings(token) {
    // axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    return axios.get(`${config.API_URL}/tourism/bookings/`);
  }

  createBooking(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/tourism/bookings/`, data);
  }

  updateBooking(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/tourism/bookings/${id}/`, data);
  }

  deleteBooking(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/tourism/bookings/${id}/`);
  }

  // Payment Actions
  getAllPayments(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/tourism/payments/`);
  }

  createPayment(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/tourism/payments/`, data);
  }

  updatePayment(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/tourism/payments/${id}/`, data);
  }

  deletePayment(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/tourism/payments/${id}/`);
  }

  // Review Actions
  getAllReviews(token) {
    // axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    return axios.get(`${config.API_URL}/tourism/reviews/`);
  }

  createReview(data, token) {
    // axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    return axios.post(`${config.API_URL}/tourism/reviews/`, data);
  }

  updateReview(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/tourism/reviews/${id}/`, data);
  }

  deleteReview(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/tourism/reviews/${id}/`);
  }

  // Amenities Actions
  getAllAmenities(token) {
    // axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    return axios.get(`${config.API_URL}/tourism/amenities/`);
  }

  createAmenity(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/tourism/amenities/`, data);
  }

  updateAmenity(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/tourism/amenities/${id}/`, data);
  }

  deleteAmenity(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/tourism/amenities/${id}/`);
  }
}

export default new TourismDataService();
