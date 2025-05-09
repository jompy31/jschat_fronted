import axios from "axios";
import config from "../config/enviroments.ts";

class FileDataService {
  getAll(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/files/`);
  }

  uploadFile(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/files/`, data);
  }
  

  deleteFile(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/files/file/${id}/delete/`);
  }
  getAllPost() {
    return axios.get(`${config.API_URL}/files/news/`);
  }

  createNewsPost(data, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/files/news/`, data);
  }

  updateNewsPost(id, data) {
    return axios.put(`${config.API_URL}/files/news/${id}/`, data);
  }

  deleteNewsPost(id) {
    return axios.delete(`${config.API_URL}/files/news/${id}/`);
  }
  getAllDistributor() {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/files/distributors/`);
  }

  createDistributor(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/files/distributors/`, data);
  }

  updateDistributor(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/files/distributors/${id}/`, data);
  }

  deleteDistributor(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/files/distributors/${id}/`);
  }

  getAllDesigns() {
    return axios.get(`${config.API_URL}/files/designs/`);
  }

  createDesign(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/files/designs/`, data);
  }

  updateDesign(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/files/designs/${id}/`, data);
  }

  deleteDesign(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/files/designs/${id}/`);
  }
}

export default new FileDataService();
