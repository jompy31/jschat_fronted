import ProductDataService from "../../../../services/products";

export const fetchProducts = async (setProducts, setSubproducts, token) => {
  try {
    const response = await ProductDataService.getAll(token);
    setProducts(response.data);
    const allSubproducts = response.data.flatMap((product) =>
      product.subproducts || []
    );
    setSubproducts(allSubproducts);
  } catch (error) {
    console.error("Error al recuperar productos:", error);
  }
};

export const fetchSubproducts = async (setSubproducts, setTotalSubproducts, token, page, page_size, searchTerm = "") => {
  try {
    const response = await ProductDataService.getAllSubProduct(token, page, page_size, searchTerm);
    setSubproducts(response.data.results || response.data);
    setTotalSubproducts(response.data.count || 0);
  } catch (error) {
    console.error("Error al recuperar subproductos:", error);
  }
};

export const fetchCombos = async (setCombos, setTotalCombos, subproductId, token, page = 1, page_size = 10) => {
  try {
    const response = await ProductDataService.getAllCombosForSubProduct(subproductId, token, page, page_size);
    setCombos(response.data.results || response.data);
    setTotalCombos(response.data.count || 0);
  } catch (error) {
    console.error("Error al recuperar combos:", error);
  }
};

export const fetchServices = async (setServices, setTotalServices, subproductId, token, page = 1, page_size = 10, search = "") => {
  try {
    const response = await ProductDataService.getAllServicesForSubProduct(subproductId, token, page, page_size, search);
    setServices(response.data.results || response.data);
    setTotalServices(response.data.count || 0);
  } catch (error) {
    console.error("Error al recuperar servicios:", error);
  }
};