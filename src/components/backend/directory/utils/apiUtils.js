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

export const fetchSubproducts = async (setSubproducts, token) => {
  try {
    const response = await ProductDataService.getAllSubProduct(token);
    setSubproducts(response.data);
  } catch (error) {
    console.error("Error al recuperar subproductos:", error);
  }
};

export const fetchCombos = async (setCombos, subproductId, token) => {
  try {
    const response = await ProductDataService.getAllCombosForSubProduct(subproductId, token);
    setCombos(response.data);
  } catch (error) {
    console.error("Error al recuperar combos:", error);
  }
};

export const fetchServices = async (setServices, subproductId, token) => {
  try {
    const response = await ProductDataService.getAllServicesForSubProduct(subproductId, token);
    setServices(response.data);
  } catch (error) {
    console.error("Error al recuperar servicios:", error);
  }
};