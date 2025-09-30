import ProductDataService from '../../../../services/products';

export const fetchProductTypes = async (token) => {
  try {
    const response = await ProductDataService.getAllProductTypes(token);
    // Handle paginated response or direct array
    const data = response.data.results || response.data || [];
    return { data };
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al obtener tipos de productos');
  }
};

export const createProductType = async (data, token) => {
  try {
    return await ProductDataService.createProductType(data, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al crear tipo de producto');
  }
};

export const updateProductType = async (id, data, token) => {
  try {
    return await ProductDataService.updateProductType(id, data, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al actualizar tipo de producto');
  }
};

export const deleteProductType = async (id, token) => {
  try {
    return await ProductDataService.deleteProductType(id, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al eliminar tipo de producto');
  }
};

export const fetchProducts = async (token) => {
  try {
    const response = await ProductDataService.getAllProducts(token);
    const data = response.data.results || response.data || [];
    return { data };
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al obtener productos');
  }
};

export const createProduct = async (data, token) => {
  try {
    // Depuración: Mostrar contenido del FormData antes de enviar
    console.log('Datos enviados a ProductDataService.createProduct:');
    for (let [key, value] of data.entries()) {
      console.log(`FormData - ${key}:`, value instanceof File ? value.name : value);
    }

    const response = await ProductDataService.createProduct(data, token);
    return response;
  } catch (err) {
    console.error('Error en createProduct:', err.response?.data || err.message);
    throw new Error(err.response?.data?.detail || 'Error al crear producto');
  }
};

export const updateProduct = async (id, data, token) => {
  try {
    return await ProductDataService.updateProduct(id, data, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al actualizar producto');
  }
};

export const deleteProduct = async (id, token) => {
  try {
    return await ProductDataService.deleteProduct(id, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al eliminar producto');
  }
};

export const fetchCharacteristics = async (token) => {
  try {
    const response = await ProductDataService.getAllCharacteristics(token);
    const data = response.data.results || response.data || [];
    return { data };
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al obtener características');
  }
};

export const createCharacteristic = async (data, token) => {
  try {
    return await ProductDataService.createCharacteristic(data, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al crear característica');
  }
};

export const updateCharacteristic = async (id, data, token) => {
  try {
    return await ProductDataService.updateCharacteristic(id, data, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al actualizar característica');
  }
};

export const deleteCharacteristic = async (id, token) => {
  try {
    return await ProductDataService.deleteCharacteristic(id, token);
  } catch (err) {
    throw new Error(err.response?.data?.detail || 'Error al eliminar característica');
  }
};