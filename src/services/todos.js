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

  // Customers
  getAllCustomers(token, page = 1, page_size = 10, search = "") {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customers/`, {
      params: { page, page_size, search },
    });
  }

  getCustomerDetails(id, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customers/${id}/`);
  }

  createCustomer(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customers/`, data);
  }

  updateCustomer(id, data, token) {
    this.setAuthHeader(token);
    return axios.patch(`${config.API_URL}/customers/${id}/`, data);
  }

  deleteCustomer(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/customers/${id}/`);
  }

  getCustomerOrders(customerId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/orders/`, {
      params: { customer: customerId },
    });
  }

  getCustomerInvoices(customerId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/invoices/`, {
      params: { order__customer: customerId },
    });
  }

  // Users
  getUserList(token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/users/`);
  }

  getUserDetails(id, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/users/${id}/`);
  }

  updateUser(id, data, token) {
    this.setAuthHeader(token);
    console.log(`Data sent to backend:`, data);
    return axios.put(`${config.API_URL}/users/${id}/`, data);
  }

  deleteUser(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/users/${id}/`)
      .then((response) => {
        console.log('Usuario eliminado:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('Error al eliminar el usuario:', error);
        throw error;
      });
  }

  // Authentication
  login(data) {
    return axios.post(`${config.API_URL}/login/`, data);
  }

  signup(data) {
    return axios.post(`${config.API_URL}/signup/`, data);
  }

  // Email
  sendEmail(data) {
    return axios.post(`${config.API_URL}/send-email/`, data);
  }

  sendEmailPreview(data) {
    return axios.post(`${config.API_URL}/send-email-preview/`, data);
  }

  // Blog Posts
  getAllBlogPosts() {
    return axios.get(`${config.API_URL}/blog/posts/`);
  }

  createBlogPost(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/blog/posts/`, data);
  }

  updateBlogPost(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/blog/posts/${id}/`, data);
  }

  deleteBlogPost(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/blog/posts/${id}/`);
  }

  getBlogPostComments(id, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/blog/posts/${id}/comments/`);
  }

  createComment(data, token) {
    this.setAuthHeader(token);
    return axios.post(
      `${config.API_URL}/blog/posts/${data.blog_post}/comments/`,
      data
    );
  }

  updateComment(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/blog/posts/comments/${id}/`, data);
  }

  deleteComment(blogPostId, commentId, token) {
    this.setAuthHeader(token);
    return axios.delete(
      `${config.API_URL}/blog/posts/${blogPostId}/comments/${commentId}/`
    );
  }

  createLike(blogPostId, userId, token) {
    const data = {
      blog_post: blogPostId,
      user: userId,
    };
    this.setAuthHeader(token);
    return axios.post(
      `${config.API_URL}/blog/posts/${blogPostId}/likes/`,
      data
    );
  }
}

export default new TodoDataService();