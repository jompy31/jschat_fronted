import axios from "axios";
import config from "../config/enviroments.ts";

class ShippingDataService {
  getAllProducts(token) {
    return axios.get(`${config.API_URL}/shipping/products/`);
  }
  getProductById(productId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/shipping/products/${productId}/`);
  }
  createProduct(productData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/shipping/products/`, productData);
  }

  updateSubProduct(productId, productData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/products/${productId}/`,
      productData
    );
  }

  deleteProduct(productId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/shipping/products/${productId}/`);
  }

  getProductImages(productId, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(`${config.API_URL}/shipping/product-image/`);
  }

  // Modificado para agregar una imagen al producto
  addProductImage(productId, imageData, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/shipping/product-image/`, imageData);
  }

  // Modificado para eliminar una imagen de un producto
  deleteProductImage(imageIds, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    const deleteRequests = imageIds.map((imageId) =>
      axios.delete(`${config.API_URL}/shipping/product-image/${imageId}/`)
    );
    return axios.all(deleteRequests);
  }

  updateNumReviews(productId, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/products/${productId}/update-num-reviews/`
    );
  }

  getAllReviews(token) {
    return axios.get(`${config.API_URL}/shipping/reviews/`);
  }
  getReviewById(reviewId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/shipping/reviews/${reviewId}/`);
  }
  createReview(reviewData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/shipping/reviews/`, reviewData);
  }

  updateReview(reviewId, reviewData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/reviews/${reviewId}/`,
      reviewData
    );
  }

  deleteReview(reviewId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/shipping/reviews/${reviewId}/`);
  }

  getAllOrders(token) {
    return axios.get(`${config.API_URL}/shipping/orders/`);
  }
  getOrderById(orderId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/shipping/orders/${orderId}/`);
  }
  createOrder(orderData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/shipping/orders/`, orderData);
  }

  updateOrder(orderId, orderData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/orders/${orderId}/`,
      orderData
    );
  }

  deleteOrder(orderId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/shipping/orders/${orderId}/`);
  }

  getAllOrderItems(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/shipping/order-items/`);
  }
  getOrderItemById(orderItemId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/shipping/order-items/${orderItemId}/`);
  }
  createOrderItem(orderItemData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/shipping/order-items/`, orderItemData);
  }

  updateOrderItem(orderItemId, orderItemData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/order-items/${orderItemId}/`,
      orderItemData
    );
  }

  deleteOrderItem(orderItemId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(
      `${config.API_URL}/shipping/order-items/${orderItemId}/`
    );
  }

  getAllShippingAddresses(token) {
    return axios.get(`${config.API_URL}/shipping/shipping-addresses/`);
  }
  getShippingAddressById(shippingAddressId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(
      `${config.API_URL}/shipping/shipping-addresses/${shippingAddressId}/`
    );
  }
  createShippingAddress(shippingAddressData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(
      `${config.API_URL}/shipping/shipping-addresses/`,
      shippingAddressData
    );
  }

  updateShippingAddress(shippingAddressId, shippingAddressData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/shipping-addresses/${shippingAddressId}/`,
      shippingAddressData
    );
  }

  deleteShippingAddress(shippingAddressId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(
      `${config.API_URL}/shipping/shipping-addresses/${shippingAddressId}/`
    );
  }

  // Funciones de formularios
  getAllForms(token) {
    return axios.get(`${config.API_URL}/shipping/forms/`);
  }
  getFormById(formId, token) {
    return axios.get(`${config.API_URL}/shipping/forms/${formId}/`);
  }
  createForm(formData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/shipping/forms/`, formData);
  }
  updateForm(formId, formData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/shipping/forms/${formId}/`, formData);
  }
  deleteForm(formId, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/shipping/forms/${formId}/`);
  }
  // Crear nuevo campo de formulario
  createFormField(formId, fieldData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(
      `${config.API_URL}/shipping/forms/${formId}/fields/`,
      fieldData
    );
  }

  // Eliminar campo de formulario
  deleteFormField(formId, fieldId, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(
      `${config.API_URL}/shipping/forms/${formId}/fields/${fieldId}/`
    );
  }

  // Funciones de respuestas de formularios
  getAllFormResponses(token) {
    return axios.get(`${config.API_URL}/shipping/form-responses/`);
  }
  getFormResponseById(responseId, token) {
    return axios.get(
      `${config.API_URL}/shipping/form-responses/${responseId}/`
    );
  }
  createFormResponse(responseData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(
      `${config.API_URL}/shipping/form-responses/`,
      responseData
    );
  }
  updateFormResponse(responseId, responseData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/form-responses/${responseId}/`,
      responseData
    );
  }
  deleteFormResponse(responseId, token) {
    return axios.delete(
      `${config.API_URL}/shipping/form-responses/${responseId}/`
    );
  }
  // Crear una respuesta de formulario para un producto específico
  createProductForm(productId, responseData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(
      `${config.API_URL}/shipping/products/${productId}/form/`,
      responseData
    );
  }

  // Actualizar una respuesta de formulario de producto
  updateProductForm(productId, responseData, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/shipping/products/${productId}/form/`,
      responseData
    );
  }

  // Eliminar una respuesta de formulario de producto
  deleteProductForm(productId, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(
      `${config.API_URL}/shipping/products/${productId}/form/`
    );
  }
}
export default new ShippingDataService();
