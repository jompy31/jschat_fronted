import axios from "axios";
import config from "../config/enviroments.ts";

class ProductDataService {
  // Configura el encabezado de autorización para todas las solicitudes
  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }

  // Productos
  getAll(token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/`);
  }

  createProduct(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/`, data);
  }

  updateProduct(id, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/${id}/update/`, data);
  }

  deleteProduct(id, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/product/${id}/delete/`);
  }

  // Subproductos
  getAllSubProduct(token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/subproducts/`);
  }

  getSubProductByEmail(email, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/subproducts/by-email/${email}/`);
  }

  createSubProduct(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/subproducts/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  updateSubProduct(subProductId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/subproducts/${subProductId}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteSubProduct(subProductId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/subproducts/${subProductId}/delete/`);
  }

  // Miembros del equipo
  getAllTeamMembers(subProductId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/subproducts/${subProductId}/teammembers/`);
  }

  createTeamMember(subProductId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/subproducts/${subProductId}/teammembers/`, data);
  }

  updateTeamMember(subProductId, teamMemberId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/subproducts/${subProductId}/teammembers/${teamMemberId}/`, data);
  }

  deleteTeamMember(subProductId, teamMemberId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/subproducts/${subProductId}/teammembers/${teamMemberId}/`);
  }

  // Horarios comerciales
  getAllBusinessHours(subProductId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/subproducts/${subProductId}/businesshours/`);
  }

  createBusinessHour(subProductId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/subproducts/${subProductId}/businesshours/`, data);
  }

  updateBusinessHour(subProductId, businessHourId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/subproducts/${subProductId}/businesshours/${businessHourId}/`, data);
  }

  deleteBusinessHour(subProductId, businessHourId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/subproducts/${subProductId}/businesshours/${businessHourId}/`);
  }

  // Cupones
  getAllCoupons(subProductId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/subproducts/${subProductId}/coupons/`);
  }

  createCoupon(subProductId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/subproducts/${subProductId}/coupons/`, data);
  }

  updateCoupon(subProductId, couponId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/subproducts/${subProductId}/coupons/${couponId}/`, data);
  }

  deleteCoupon(subProductId, couponId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/subproducts/${subProductId}/coupons/${couponId}/`);
  }

  // Servicios
  getAllServices(token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/services/`);
  }

  getAllServicesForSubProduct(subProductId, token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/subproducts/${subProductId}/services/`);
  }

  createServiceForSubProduct(subProductId, data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/subproducts/${subProductId}/services/`, {
      ...data,
      subproduct: subProductId, // Incluir subproduct explícitamente
    });
  }
  updateServiceForSubProduct(subProductId, serviceId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/subproducts/${subProductId}/services/`, {
      ...data,
      service_id: serviceId,
      subproduct: subProductId, // Mantener subproduct en la actualización
    });
  }
  deleteServiceForSubProduct(subProductId, serviceId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/subproducts/${subProductId}/services/${serviceId}/`);
  }

  // Combos
  getAllCombos(token) {
    this.setAuthHeader(token);
    return axios.get(`${config.API_URL}/products/combos/`);
  }

  getAllCombosForSubProduct(subProductId, token) {
    this.setAuthHeader(token);
    // Obtener servicios del subproducto primero
    return axios
      .get(`${config.API_URL}/products/subproducts/${subProductId}/services/`)
      .then((response) => {
        const serviceIds = response.data.map((service) => service.id);
        // Filtrar combos que contengan al menos uno de los serviceIds
        return axios.get(`${config.API_URL}/products/combos/`).then((comboResponse) => {
          const filteredCombos = comboResponse.data.filter((combo) =>
            combo.services.some((service) => serviceIds.includes(service.id))
          );
          return { data: filteredCombos };
        });
      });
  }

  createCombo(data, token) {
    this.setAuthHeader(token);
    return axios.post(`${config.API_URL}/products/combos/`, data);
  }

  updateCombo(comboId, data, token) {
    this.setAuthHeader(token);
    return axios.put(`${config.API_URL}/products/combos/${comboId}/`, data);
  }

  deleteCombo(comboId, token) {
    this.setAuthHeader(token);
    return axios.delete(`${config.API_URL}/products/combos/${comboId}/`);
  }

  // Características
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
    return axios.delete(`${config.API_URL}/products/characteristics/${id}/delete/`);
  }
}

export default new ProductDataService();