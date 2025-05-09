import axios from "axios";
import config from "../config/enviroments.ts";

class ProductDataService {
  // Obtener todos los productos
  getAll() {
    return axios.get(`${config.API_URL}/products/`); // URL para obtener productos
  }

  // Obtener todos los subproductos
  getAllSubProduct() {
    return axios.get(`${config.API_URL}/products/subproducts/`); // URL para obtener subproductos
  }
  getSubProductByEmail(email) {
    return axios.get(`${config.API_URL}/products/subproducts/by-email/${email}/`);
  }
  createSubProduct(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post(`${config.API_URL}/products/subproducts/`, data);
  }

  updateSubProduct(subProductId, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(
      `${config.API_URL}/products/subproducts/${subProductId}/`,
      data
    );
  }

  deleteSubProduct(subProductId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(
      `${config.API_URL}/products/subproducts/${subProductId}/delete/`
    );
  }

  createProduct(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post("${config.API_URL}/products/", data); // Cambiar la URL
  }
  updateProduct(id, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/products/${id}/update/`, data); // Use the correct URL for updating a product
  }

  deleteProduct(id, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/products/product/${id}/delete/`); // Cambiar la URL
  }
  // Equipo (teamMember)
  getAllTeamMembers(subProductId, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(
      `${config.API_URL}/products/subproducts/${subProductId}/teammembers/`
    );
  }

  createTeamMember(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/products/teammembers/`, data);
  }

  updateTeamMember(teamMemberId, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(
      `${config.API_URL}/products/teammembers/${teamMemberId}/`,
      data
    );
  }

  deleteTeamMember(teamMemberId, token) {
    return axios.delete(
      `${config.API_URL}/products/teammembers/${teamMemberId}/`
    );
  }

  // Horarios comerciales (businessHours)
  getAllBusinessHours(subProductId, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(
      `${config.API_URL}/products/subproducts/${subProductId}/businesshours/`
    );
  }

  createBusinessHour(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/products/businesshours/`, data);
  }

  updateBusinessHour(businessHourId, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(
      `${config.API_URL}/products/subproducts/${businessHourId}/businesshours/`,
      data
    );
  }

  deleteBusinessHour(businessHourId, token) {
    return axios.delete(
      `${config.API_URL}/products/subproducts/${businessHourId}/businesshours/`
    );
  }

  // Cupones (coupons)
  getAllCoupons(subProductId, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(
      `${config.API_URL}/products/subproducts/${subProductId}/coupons/`
    );
  }

  createCoupon(data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(`${config.API_URL}/products/subproducts/coupons/`, data);
  }

  updateCoupon(couponId, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(
      `${config.API_URL}/products/subproducts/coupons/${couponId}/`,
      data
    );
  }

  deleteCoupon(couponId, token) {
    return axios.delete(
      `${config.API_URL}/products/subproducts/coupons/${couponId}/`
    );
  }

  getAllCharacteristics(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/products/characteristics/`); // URL para obtener características
  }

  createCharacteristic(data, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post("${config.API_URL}/products/characteristics/", data); // URL para crear característica
  }

  updateCharacteristic(id, data, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/products/characteristics/${id}/`, data); // URL para actualizar característica
  }

  deleteCharacteristic(id, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/products/characteristics/${id}/`); // URL para eliminar característica
  }

  getAllServices(token) {
    return axios.get(`${config.API_URL}/products/services/`);
  }

  getAllServicesForSubProduct(subProductId, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.get(
      `${config.API_URL}/products/subproducts/${subProductId}/services/`
    );
  }

  createServiceForSubProduct(subProductId, data, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.post(
      `${config.API_URL}/products/subproducts/${subProductId}/services/`,
      data
    );
  }

  updateServiceForSubProduct(subProductId, serviceId, data, token) {
    axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.put(
      `${config.API_URL}/products/subproducts/${subProductId}/services/${serviceId}/`,
      data
    );
  }

  deleteServiceForSubProduct(subProductId, serviceId, token) {
    // axios.defaults.headers.common[`Authorization`] = `Token ` + token;
    return axios.delete(
      `${config.API_URL}/products/subproducts/${subProductId}/services/${serviceId}/`
    );
  }
  getAllCombos(token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.get(`${config.API_URL}/products/combos/`); // URL for getting combos
  }

  createCombo(data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.post("${config.API_URL}/products/combos/", data); // URL for creating combo
  }

  updateCombo(comboId, data, token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.put(`${config.API_URL}/products/combos/${comboId}/`, data); // URL for updating combo
  }

  deleteCombo(comboId, token) {
    // axios.defaults.headers.common["Authorization"] = "Token " + token;
    return axios.delete(`${config.API_URL}/products/combos/${comboId}/`);
  }
}

export default new ProductDataService();
