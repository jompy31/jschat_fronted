// frontend_github/jschat_fronted/src/services/products.js
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

  // === PRODUCT TYPES ===
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

  // === PRODUCTS ===
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

  // NUEVO: Establecer producto como predeterminado
  setDefaultProduct(id, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/products/${id}/set_default/`);
  }

  // === CHARACTERISTICS ===
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

  // === ORDERS ===
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

  // === PAYMENTS ===
  getAllPayments(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/payments/`, {
      params: { page, page_size },
    });
  }

  getPaymentsByOrderId(orderId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/payments/`, {
      params: { order: orderId },
    });
  }

  addPaymentToOrder(orderId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/orders/${orderId}/add_payment/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  updatePayment(paymentId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/payments/${paymentId}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  deletePayment(paymentId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/payments/${paymentId}/`);
  }

  // === CUSTOMERS ===
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

  getProductionQueueDashboard(token, filters = {}) {
    this.setAuthHeader(token);

    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.queue_type) params.queue_type = filters.queue_type;
    if (filters.status) params.status = filters.status;

    return axios.get(`${config.API_URL}/production-queue-dashboard/`, { params });
  }

  // === PROMOTIONS ===
  getAllPromotions(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/promotions/`, {
      params: { page, page_size },
    });
  }

  getPromotionById(id, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/promotions/${id}/`);
  }

  createPromotion(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/promotions/`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updatePromotion(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/promotions/${id}/`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  partialUpdatePromotion(id, data, token) {
    this.setAuthHeader(token);
    return axios.patch(`${config.API_URL}/promotions/${id}/`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deletePromotion(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/promotions/${id}/`);
  }

  // === CUSTOMER POINTS ===
  getCustomerPoints(customerId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customer-points/`, {
      params: { customer: customerId }
    });
  }

  // NUEVO: Otorgar puntos manualmente (award manual)
  awardManualPoints(customerId, data, token) {
    // data: { points, reason, notes? }
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customers/${customerId}/award-points/`, data);
  }

  addPointsToCustomer(customerId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customer-points/`, {
      customer: customerId,
      ...data
    });
  }

  // === POINT CONFIGS (MÚLTIPLES) ===
  getAllPointConfigs(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/points-config/`, {
      params: { page, page_size },
    });
  }

  createPointConfig(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/points-config/`, data);
  }

  updatePointConfig(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/points-config/${id}/`, data);
  }

  deletePointConfig(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/points-config/${id}/`);
  }

  setDefaultPointConfig(id, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/points-config/${id}/set_default/`);
  }

  setActivePointConfig(id, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/points-config/${id}/set_active/`);
  }

  redeemPoints(customerId, data, token) {
    // data: { points_to_redeem, reward_id?, notes? }
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customers/${customerId}/redeem-points/`, data);
  }

  getPointsHistory(customerId, token, page = 1, page_size = 50) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customer-points/`, {
      params: { customer: customerId, page, page_size }
    });
  }

  // === CUSTOMER TAGS CONFIG ===
  getAllCustomerTags(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customer-tags/`, {
      params: { page, page_size },
    });
  }

  createCustomerTag(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customer-tags/`, data);
  }

  updateCustomerTag(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/customer-tags/${id}/`, data);
  }

  deleteCustomerTag(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/customer-tags/${id}/`);
  }

  // === ASSIGN TAGS TO CUSTOMER ===
  assignTagToCustomer(customerId, tagId, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customers/${customerId}/assign-tag/`, { tag: tagId });
  }

  removeTagFromCustomer(customerId, tagId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/customers/${customerId}/tags/${tagId}/`);
  }

  getCustomerTags(customerId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/customers/${customerId}/tags/`);
  }

  // === REWARDS (si usas recompensas) ===
  getAllRewards(token, page = 1, page_size = 1000) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/rewards/`, {
      params: { page, page_size },
    });
  }

  createReward(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/rewards/`, data);
  }

  updateReward(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/rewards/${id}/`, data);
  }

  deleteReward(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/rewards/${id}/`);
  }

  // NUEVO: Otorgar recompensa manualmente
  awardManualReward(customerId, rewardId, token, notes = "") {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/customers/${customerId}/award-reward/`, {
      reward: rewardId,
      notes
    });
  }
}

export default new ProductDataService();