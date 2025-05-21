import axios from "axios";
import config from "../config/enviroments.ts";

class FileDataService {
  // Helper to set Authorization header
  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  // Fetch all files with pagination
  getAll(token, page = 1, pageSize = 10) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/files/`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
  }

  // Upload a file
  uploadFile(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/files/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Delete a file
  deleteFile(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/files/file/${id}/delete/`);
  }

  // Fetch all news posts with pagination
  getAllPost(token, page = 1, pageSize = 10) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/files/news/`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
  }

  // Create a news post
  createNewsPost(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/files/news/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Update a news post
  updateNewsPost(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/files/news/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Delete a news post
  deleteNewsPost(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/files/news/${id}/`);
  }

  // Fetch all distributors
  getAllDistributor(token, page = 1, pageSize = 10) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/distributors/`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
  }

  // Create a distributor
  createDistributor(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/distributors/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Update a distributor
  updateDistributor(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/distributors/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Delete a distributor
  deleteDistributor(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/distributors/${id}/`);
  }

  // Fetch all designs with pagination
  getAllDesigns(token, page = 1, pageSize = 10) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/files/designs/`, {
      params: {
        page,
        page_size: pageSize,
      },
    });
  }

  // Create a design
  createDesign(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/files/designs/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Update a design
  updateDesign(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/files/designs/${id}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Delete a design
  deleteDesign(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/files/designs/${id}/`);
  }

  // Fetch distributor services
  getDistributorServices(distributorId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/distributors/${distributorId}/services/`);
  }

  // Create a distributor service
  createDistributorService(distributorId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/distributors/${distributorId}/services/`, data);
  }

  // Delete a distributor service
  deleteDistributorService(distributorId, serviceId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/distributors/${distributorId}/services/${serviceId}/`);
  }
}

export default new FileDataService();