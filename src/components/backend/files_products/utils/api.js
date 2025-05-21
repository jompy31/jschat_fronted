import ProductDataService from '../../../../services/products';
import TodoDataService from '../../../../services/todos';

export const getAllProducts = async () => {
  const response = await ProductDataService.getAll();
  return Array.isArray(response.data.results) ? response.data.results : response.data;
};

export const createProduct = async (formData, token) => {
  const response = await ProductDataService.createProduct(formData, token);
  return response.data;
};

export const updateProduct = async (id, formData, token) => {
  const response = await ProductDataService.updateProduct(id, formData, token);
  return response.data;
};

export const deleteProduct = async (id, token) => {
  await ProductDataService.deleteProduct(id, token);
};

export const getAllCharacteristics = async () => {
  const response = await ProductDataService.getAllCharacteristics();
  return Array.isArray(response.data.results) ? response.data.results : response.data;
};

export const createCharacteristic = async (data, token) => {
  await ProductDataService.createCharacteristic(data, token);
};

export const updateCharacteristic = async (id, data) => {
  await ProductDataService.updateCharacteristic(id, data);
};

export const deleteCharacteristic = async (id) => {
  await ProductDataService.deleteCharacteristic(id);
};

export const getAllServices = async () => {
  const response = await ProductDataService.getAllServices();
  return Array.isArray(response.data.results) ? response.data.results : response.data;
};

export const getUserList = async (token) => {
  const response = await TodoDataService.getUserList(token);
  return Array.isArray(response.data.results) ? response.data.results : response.data;
};

export const createServiceForSubProduct = async (subProductId, service) => {
  const response = await ProductDataService.createServiceForSubProduct(subProductId, service);
  return response.data;
};

export const deleteServiceForSubProduct = async (subProductId, serviceId) => {
  await ProductDataService.deleteServiceForSubProduct(subProductId, serviceId);
};

export const deleteSubProduct = async (id, token) => {
  await ProductDataService.deleteSubProduct(id, token);
};