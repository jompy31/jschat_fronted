import axios from "axios";
import config from "../config/enviroments.ts";

class TodoDataService {
  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }
  getAll(token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/todos/`);
  }
  createTodo(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/todos/`, data);
  }
  updateTodo(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/todos/${id}`, data);
  }
  deleteTodo(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/todos/${id}`);
  }
  completeTodo(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/todos/${id}/complete`);
  }
  getUserList(token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/users/`);
  }
  getUserDetails(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/users/${id}/`);
  }
  updateUser(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    console.log(`Data sent to backend:`, data); // Muestra los datos en la consola del navegador
    return axios.put(`${config.API_URL}/users/${id}/`, data);
  }
  deleteUser(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios
      .delete(`${config.API_URL}/users/${id}/delete/`)
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
    return axios.get(`${config.API_URL}/work-experience/`);
  }

  createWorkExperience(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/work-experience/`, data);
  }

  updateWorkExperience(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/work-experience/${id}/`, data);
  }

  deleteWorkExperience(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/work-experience/${id}/`);
  }

  // Skills
  getAllSkills(token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/skills/`);
  }

  createSkill(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/skills/`, data);
  }

  updateSkill(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/skills/${id}/`, data);
  }

  deleteSkill(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/skills/${id}/`);
  }
  login(data) {
    return axios.post(`${config.API_URL}/login/`, data);
  }
  signup(data) {
    return axios.post(`${config.API_URL}/signup/`, data);
  }

  sendEmail(data) {
    return axios.post(`${config.API_URL}/send-email/`, data);
  }
  sendEmailPreview(data) {
    return axios.post(`${config.API_URL}/send-email-preview/`, data);
  }
  getAllLeads(token, page = 1, page_size = 100) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/leads/`, {
      params: { page, page_size },
    });
  }

  createLead(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/leads/`, data);
  }

  updateLead(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/leads/${id}/`, data);
  }

  deleteLead(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/leads/${id}/`);
  }
  getLeadComments(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/leads/${id}/comments/`);
  }

  createCommentlead(data, token) {
    const commentData = {
      lead: data.lead,
      comment: data.comment,
    };

    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/leads/${data.lead}/comments/`,
      commentData
    );
  }

  updateComment(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/leads/comments/${id}/`, data);
  }

  deleteCommentContact(leadId, commentId, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(
      `${config.API_URL}/leads/comments/${leadId}/${commentId}/`
    );
  }

  getAllBlogPosts() {
    return axios.get(`${config.API_URL}/blog/posts/`);
  }

  createBlogPost(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/blog/posts/`, data);
  }

  updateBlogPost(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/blog/posts/${id}/`, data);
  }

  deleteBlogPost(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(`${config.API_URL}/blog/posts/${id}/`);
  }

  getBlogPostComments(id, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/blog/posts/${id}/comments/`);
  }

  createComment(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/blog/posts/${data.blog_post}/comments/`,
      data
    );
  }

  updateComment(id, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(`${config.API_URL}/blog/posts/comments/${id}/`, data);
  }

  deleteComment(blogPostId, commentId, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(
      `${config.API_URL}/blog/posts/${blogPostId}/comments/${commentId}/`
    );
  }

  createLike(blogPostId, userId, token) {
    const data = {
      blog_post: blogPostId,
      user: userId,
    };

    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/blog/posts/${blogPostId}/likes/`,
      data
    );
  }
}
export default new TodoDataService();
