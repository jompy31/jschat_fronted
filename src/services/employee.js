import axios from "axios";
import config from "../config/enviroments.ts";

class JobDataService {
  // Métodos para el modelo Empresa (Company)
  getAllCompanies(token) {
    return axios.get(`${config.API_URL}/employee/companies/`);
  }

  createCompany(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/companies/`, data);
  }

  updateCompany(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/employee/companies/${id}/`, data);
  }

  deleteCompany(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/companies/${id}/`);
  }

  // Métodos para el modelo Categoría de trabajo (JobCategory)
  getAllJobCategories(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/job-categories/`);
  }

  createJobCategory(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/job-categories/`, data);
  }

  updateJobCategory(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/employee/job-categories/${id}/`, data);
  }

  deleteJobCategory(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/job-categories/${id}/`);
  }

  // Métodos para el modelo Publicación de trabajo (JobPosting)
  getAllJobPostings(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/jobs/`);
  }

  createJobPosting(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/jobs/`, data);
  }

  updateJobPosting(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/employee/jobs/${id}/`, data);
  }

  deleteJobPosting(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/jobs/${id}/`);
  }

  // Métodos para el modelo Aplicación de trabajo (JobApplication)
  createJobApplication(data, token, jobId) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/jobs/${jobId}/apply/`, data);
  }

  getAllJobApplications(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/applications/`);
  }
  deleteJobApplication(jobId, token, applicationId) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(
      `${config.API_URL}/employee/jobs/${jobId}/apply/${applicationId}/`
    );
  }

  // Métodos para el modelo Pregunta de trabajo (JobQuestion)
  createJobQuestion(data, token, jobId) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(
      `${config.API_URL}/employee/jobs/${jobId}/questions/`,
      data
    );
  }

  getAllJobQuestions(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/questions/`);
  }

  // Métodos para el modelo Alerta de trabajo (JobAlert)
  getAllJobAlerts(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/job-alerts/`);
  }

  createJobAlert(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/job-alerts/create/`, data);
  }
  deleteJobAlert(jobId, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/job-alerts/${jobId}/`);
  }

  // Métodos para el modelo Nivel de experiencia (ExperienceLevel)
  getAllExperienceLevels(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/experience-levels/`);
  }

  createExperienceLevel(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/experience-levels/`, data);
  }

  updateExperienceLevel(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/employee/experience-levels/${id}/`,
      data
    );
  }

  deleteExperienceLevel(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/experience-levels/${id}/`);
  }

  // Métodos para Habilidades (Skill)
  getAllSkills(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/skills/`);
  }

  createSkill(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/skills/`, data);
  }

  updateSkill(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/employee/skills/${id}/`, data);
  }

  deleteSkill(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/skills/${id}/`);
  }

  // Métodos para Beneficios (Benefit)
  getAllBenefits(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/benefits/`);
  }

  createBenefit(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/benefits/`, data);
  }

  updateBenefit(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/employee/benefits/${id}/`, data);
  }

  deleteBenefit(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/benefits/${id}/`);
  }

  // Métodos para Etiquetas de trabajo (JobTag)
  getAllJobTags(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/employee/job-tags/`);
  }

  createJobTag(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/employee/job-tags/`, data);
  }

  updateJobTag(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/employee/job-tags/${id}/`, data);
  }

  deleteJobTag(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/employee/job-tags/${id}/`);
  }
}

export default new JobDataService();
