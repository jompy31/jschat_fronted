import axios from "axios";
import config from "../config/enviroments.ts";

class ProductDataService {
  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  getAllProductTypes(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/product-types/`, {
      params: { page, page_size },
    });
  }

  createProductType(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/product-types/`, data);
  }

  updateProductType(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/product-types/${id}/`, data);
  }

  deleteProductType(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/product-types/${id}/`);
  }

  getAllProducts(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/products/`, {
      params: { page, page_size },
    });
  }

  createProduct(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/products/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  updateProduct(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/products/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  deleteProduct(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/products/${id}/`);
  }

  getAllCharacteristics(token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/characteristics/`);
  }

  createCharacteristic(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/characteristics/`, data);
  }

  updateCharacteristic(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/characteristics/${id}/`, data);
  }

  deleteCharacteristic(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/characteristics/${id}/`);
  }

  getAllOrders(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/orders/`, {
      params: { page, page_size },
    });
  }

  getOrderById(id, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/orders/${id}/`);
  }

  createOrder(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/orders/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  updateOrder(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/orders/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  deleteOrder(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/orders/${id}/`);
  }

  downloadInvoicePDF(id, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/orders/${id}/generate_invoice_pdf/`, {
      responseType: 'blob',
    });
  }

  addOrderEvent(id, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/orders/${id}/add_event/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  updateOrderEvent(orderId, eventId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/orders/${orderId}/events/${eventId}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  deleteOrderEvent(orderId, eventId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/orders/${orderId}/events/${eventId}/`);
  }

  getAllCustomers(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customers/`, {
      params: { page, page_size },
    });
  }

  createCustomer(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customers/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export default new ProductDataService();