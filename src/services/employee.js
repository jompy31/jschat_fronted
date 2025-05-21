import axios from "axios";
import config from "../config/enviroments.ts";

class JobDataService {
  // Helper method to set headers with token
  setAuthHeaders(token) {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  // Métodos para el modelo Empresa (Company)
  getAllCompanies(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/companies/`, {
      params: { page, page_size },
    });
  }

  createCompany(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/companies/`, data);
  }

  updateCompany(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(`${config.API_URL}/employee/companies/${id}/`, data);
  }

  deleteCompany(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/companies/${id}/`);
  }

  // Métodos para el modelo Categoría de trabajo (JobCategory)
  getAllJobCategories(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/job-categories/`, {
      params: { page, page_size },
    });
  }

  createJobCategory(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/job-categories/`, data);
  }

  updateJobCategory(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(`${config.API_URL}/employee/job-categories/${id}/`, data);
  }

  deleteJobCategory(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/job-categories/${id}/`);
  }

  // Métodos para el modelo Publicación de trabajo (JobPosting)
  getAllJobPostings(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/jobs/`, {
      params: { page, page_size },
    });
  }

  createJobPosting(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/jobs/`, data);
  }

  updateJobPosting(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(`${config.API_URL}/employee/jobs/${id}/`, data);
  }

  deleteJobPosting(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/jobs/${id}/`);
  }

  // Métodos para el modelo Aplicación de trabajo (JobApplication)
  createJobApplication(data, token, jobId) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/jobs/${jobId}/apply/`, data);
  }

  getAllJobApplications(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/applications/`, {
      params: { page, page_size },
    });
  }

  deleteJobApplication(jobId, token, applicationId) {
    this.setAuthHeaders(token);
    return axios.delete(
      `${config.API_URL}/employee/jobs/${jobId}/apply/${applicationId}/`
    );
  }

  // Métodos para el modelo Alerta de trabajo (JobAlert)
  getAllJobAlerts(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/job-alerts/`, {
      params: { page, page_size },
    });
  }

  createJobAlert(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/job-alerts/create/`, data);
  }

  deleteJobAlert(jobId, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/job-alerts/${jobId}/`);
  }

  // Métodos para el modelo Nivel de experiencia (ExperienceLevel)
  getAllExperienceLevels(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/experience-levels/`, {
      params: { page, page_size },
    });
  }

  createExperienceLevel(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/experience-levels/`, data);
  }

  updateExperienceLevel(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(
      `${config.API_URL}/employee/experience-levels/${id}/`,
      data
    );
  }

  deleteExperienceLevel(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/experience-levels/${id}/`);
  }

  // Métodos para Habilidades (Skill)
  getAllSkills(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/skills/`, {
      params: { page, page_size },
    });
  }

  createSkill(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/skills/`, data);
  }

  updateSkill(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(`${config.API_URL}/skills/${id}/`, data);
  }

  deleteSkill(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/skills/${id}/`);
  }

  // Métodos para Beneficios (Benefit)
  getAllBenefits(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/benefits/`, {
      params: { page, page_size },
    });
  }

  createBenefit(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/benefits/`, data);
  }

  updateBenefit(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(`${config.API_URL}/employee/benefits/${id}/`, data);
  }

  deleteBenefit(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/benefits/${id}/`);
  }

  // Métodos para Etiquetas de trabajo (JobTag)
  getAllJobTags(token, page = 1, page_size = 100) {
    this.setAuthHeaders(token);
    return axios.get(`${config.API_URL}/employee/job-tags/`, {
      params: { page, page_size },
    });
  }

  createJobTag(data, token) {
    this.setAuthHeaders(token);
    return axios.post(`${config.API_URL}/employee/job-tags/`, data);
  }

  updateJobTag(id, data, token) {
    this.setAuthHeaders(token);
    return axios.put(`${config.API_URL}/employee/job-tags/${id}/`, data);
  }

  deleteJobTag(id, token) {
    this.setAuthHeaders(token);
    return axios.delete(`${config.API_URL}/employee/job-tags/${id}/`);
  }
}

export default new JobDataService();