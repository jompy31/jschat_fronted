import JobDataService from '../../../../services/employee';
import TodoDataService from '../../../../services/todos';
import axios from 'axios';

export const getAllCompanies = (token) => JobDataService.getAllCompanies(token);
export const createCompany = (data, token) => JobDataService.createCompany(data, token);
export const updateCompany = (id, data, token) => JobDataService.updateCompany(id, data, token);
export const deleteCompany = (id, token) => JobDataService.deleteCompany(id, token);

export const getAllJobCategories = (token) => JobDataService.getAllJobCategories(token);
export const createJobCategory = (data, token) => JobDataService.createJobCategory(data, token);
export const updateJobCategory = (id, data, token) => JobDataService.updateJobCategory(id, data, token);
export const deleteJobCategory = (id, token) => JobDataService.deleteJobCategory(id, token);

export const getAllJobPostings = (token) => JobDataService.getAllJobPostings(token);
export const createJobPosting = (data, token) => JobDataService.createJobPosting(data, token);
export const updateJobPosting = (id, data, token) => JobDataService.updateJobPosting(id, data, token);
export const deleteJobPosting = (id, token) => JobDataService.deleteJobPosting(id, token);

export const getAllJobApplications = (token) => JobDataService.getAllJobApplications(token);
export const createJobApplication = (data, token, jobId) => JobDataService.createJobApplication(data, token, jobId);
export const updateJobApplication = (id, data, token) => JobDataService.updateJobApplication(id, data, token);
export const deleteJobApplication = (jobId, token, applicationId) => JobDataService.deleteJobApplication(jobId, token, applicationId);

export const getAllJobQuestions = (token) => JobDataService.getAllJobQuestions(token);
export const createJobQuestion = (data, token, jobId) => JobDataService.createJobQuestion(data, token, jobId);
export const updateJobQuestion = (id, data, token) => JobDataService.updateJobQuestion(id, data, token);
export const deleteJobQuestion = (id, token) => JobDataService.deleteJobQuestion(id, token);

export const getAllJobAlerts = (token) => JobDataService.getAllJobAlerts(token);
export const createJobAlert = (data, token) => JobDataService.createJobAlert(data, token);
export const updateJobAlert = (id, data, token) => JobDataService.updateJobAlert(id, data, token);
export const deleteJobAlert = (id, token) => JobDataService.deleteJobAlert(id, token);

export const getAllExperienceLevels = (token) => JobDataService.getAllExperienceLevels(token);
export const createExperienceLevel = (data, token) => JobDataService.createExperienceLevel(data, token);
export const updateExperienceLevel = (id, data, token) => JobDataService.updateExperienceLevel(id, data, token);
export const deleteExperienceLevel = (id, token) => JobDataService.deleteExperienceLevel(id, token);

export const getAllSkills = (token) => JobDataService.getAllSkills(token);
export const createSkill = (data, token) => JobDataService.createSkill(data, token);
export const updateSkill = (id, data, token) => JobDataService.updateSkill(id, data, token);
export const deleteSkill = (id, token) => JobDataService.deleteSkill(id, token);

export const getAllBenefits = (token) => JobDataService.getAllBenefits(token);
export const createBenefit = (data, token) => JobDataService.createBenefit(data, token);
export const updateBenefit = (id, data, token) => JobDataService.updateBenefit(id, data, token);
export const deleteBenefit = (id, token) => JobDataService.deleteBenefit(id, token);

export const getAllJobTags = (token) => JobDataService.getAllJobTags(token);
export const createJobTag = (data, token) => JobDataService.createJobTag(data, token);
export const updateJobTag = (id, data, token) => JobDataService.updateJobTag(id, data, token);
export const deleteJobTag = (id, token) => JobDataService.deleteJobTag(id, token);

export const getUserList = (token) => TodoDataService.getUserList(token);
export const getAllWorkExperiences = (token) => TodoDataService.getAllWorkExperiences(token);

export const signup = (data) => TodoDataService.signup(data);

export const sendEmail = async (emailData) => {
  const data = {
    subject: emailData.subject,
    message: emailData.message,
    from_email: emailData.from_email,
    recipient_list: emailData.recipient_list.join(','),
    attachments: emailData.attachments,
  };
  try {
    const response = await axios.post('https://abcupon.com/api/send-email/', data, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error('Error sending email');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};