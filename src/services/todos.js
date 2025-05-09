import axios from "axios";
import config from "../config/enviroments.ts";

class TodoDataService {
  getAll(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/api/todos/`);
  }
  createTodo(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/api/todos/`, data);
  }
  updateTodo(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/api/todos/${id}`, data);
  }
  deleteTodo(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/api/todos/${id}`);
  }
  completeTodo(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/api/todos/${id}/complete`);
  }
  getUserList(token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/users/`);
  }
  getUserDetails(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/users/${id}/`);
  }
  updateUser(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    console.log(`Data sent to backend:`, data); // Muestra los datos en la consola del navegador
    return axios.put(`${config.API_URL}/api/users/${id}/`, data);
  }
  deleteUser(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios
      .delete(`${config.API_URL}/api/users/${id}/delete/`)
      .then((response) => {
        console.log(response.data); // Imprime la respuesta si la eliminación fue exitosa
      })
      .catch((error) => {
        console.error(error); // Imprime el error si la eliminación falló
      });
  }
  // Work Experience
  getAllWorkExperiences(token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/work-experience/`);
  }

  createWorkExperience(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/api/work-experience/`, data);
  }

  updateWorkExperience(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/api/work-experience/${id}/`, data);
  }

  deleteWorkExperience(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/api/work-experience/${id}/`);
  }

  // Skills
  getAllSkills(token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/skills/`);
  }

  createSkill(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/api/skills/`, data);
  }

  updateSkill(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/api/skills/${id}/`, data);
  }

  deleteSkill(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/api/skills/${id}/`);
  }
  login(data) {
    return axios.post(`${config.API_URL}/api/login/`, data);
  }
  signup(data) {
    return axios.post(`${config.API_URL}/api/signup/`, data);
  }

  sendEmail(data) {
    return axios.post(`${config.API_URL}/send-email/`, data);
  }
  sendEmailPreview(data) {
    return axios.post(`${config.API_URL}/send-email-preview/`, data);
  }
  getAllLeads(token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/leads/`);
  }

  createLead(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/api/leads/`, data);
  }

  updateLead(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/api/leads/${id}/`, data);
  }

  deleteLead(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/api/leads/${id}/`);
  }
  getLeadComments(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/leads/${id}/comments/`);
  }

  createCommentlead(data, token) {
    const commentData = {
      lead: data.lead,
      comment: data.comment,
    };

    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/api/leads/${data.lead}/comments/`,
      commentData
    );
  }

  updateComment(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/api/leads/comments/${id}/`, data);
  }

  deleteCommentContact(leadId, commentId, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(
      `${config.API_URL}/api/leads/comments/${leadId}/${commentId}/`
    );
  }

  getAllBlogPosts() {
    return axios.get(`${config.API_URL}/api/blog/posts/`);
  }

  createBlogPost(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/api/blog/posts/`, data);
  }

  updateBlogPost(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/api/blog/posts/${id}/`, data);
  }

  deleteBlogPost(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/api/blog/posts/${id}/`);
  }

  getBlogPostComments(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/api/blog/posts/${id}/comments/`);
  }

  createComment(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/api/blog/posts/${data.blog_post}/comments/`,
      data
    );
  }

  updateComment(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/api/blog/posts/comments/${id}/`, data);
  }

  deleteComment(blogPostId, commentId, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(
      `${config.API_URL}/api/blog/posts/${blogPostId}/comments/${commentId}/`
    );
  }

  createLike(blogPostId, userId, token) {
    const data = {
      blog_post: blogPostId,
      user: userId,
    };

    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/api/blog/posts/${blogPostId}/likes/`,
      data
    );
  }
}
export default new TodoDataService();
