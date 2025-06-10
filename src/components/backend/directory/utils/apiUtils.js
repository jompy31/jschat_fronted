import ProductDataService from "../../../../services/products";

export const fetchProducts = async (setProducts, setSubproducts, token) => {
  try {
    const response = await ProductDataService.getAll(token);
    const productsData = response.data.results || response.data; // Usar results si existe, sino response.data
    setProducts(Array.isArray(productsData) ? productsData : []); // Asegurar que siempre sea un array
    const allSubproducts = productsData.flatMap((product) =>
      product.subproducts || []
    );
    setSubproducts(allSubproducts);
  } catch (error) {
    console.error("Error al recuperar productos:", error);
    setProducts([]); // En caso de error, establecer un array vacío
  }
};

export const fetchSubproducts = async (setSubproducts, setTotalSubproducts, token, page, page_size, searchTerm = "") => {
  try {
    let response;
    if (searchTerm.trim()) {
      // Usar el endpoint de búsqueda cuando hay un término de búsqueda
      response = await ProductDataService.searchSubProduct(token, searchTerm, page, page_size);
    } else {
      // Usar el endpoint original cuando no hay término de búsqueda
      response = await ProductDataService.getAllSubProduct(token, page, page_size);
    }
    setSubproducts(response.data.results || response.data);
    setTotalSubproducts(response.data.count || 0);
  } catch (error) {
    console.error("Error al recuperar subproductos:", error);
    setSubproducts([]);
    setTotalSubproducts(0);
  }
};



export const fetchCombos = async (
  setCombos,
  setTotalCombos = () => {},
  subproductId,
  token,
  page = 1,
  page_size = 10
) => {
  if (!subproductId) {
    console.warn("No subproductId provided for fetching combos");
    setCombos([]);
    setTotalCombos(0);
    return;
  }
  try {
    const response = await ProductDataService.getAllCombosForSubProduct(
      subproductId,
      token,
      page,
      page_size
    );
    setCombos(response.data || []);
    setTotalCombos(response.count || 0);
  } catch (error) {
    console.error("Error al recuperar combos:", error);
    setCombos([]);
    setTotalCombos(0);
  }
};

export const fetchServices = async (
  setServices,
  setTotalServices = () => {},
  subproductId,
  token,
  page = 1,
  page_size = 10,
  search = ""
) => {
  if (!subproductId) {
    console.warn("No subproductId provided for fetching services");
    setServices([]);
    setTotalServices(0);
    return;
  }
  try {
    const response = await ProductDataService.getAllServicesForSubProduct(
      subproductId,
      token,
      page,
      page_size,
      search
    );
    setServices(response.data.results || response.data);
    setTotalServices(response.data.count || 0);
  } catch (error) {
    console.error("Error al recuperar servicios:", error);
    setServices([]);
    setTotalServices(0);
  }
};