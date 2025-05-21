import { CACHE_KEY, CHUNK_SIZE } from "./constants";
import ProductDataService from "../../../../services/products";
import { toast } from "react-toastify";

const normalizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const clearOldCache = () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(CACHE_KEY))
    .forEach((key) => localStorage.removeItem(key));
};

const fetchProducts = async (page = 1, page_size = CHUNK_SIZE) => {
  try {
    let allProducts = [];
    let allSubProducts = [];
    let allServices = [];

    const cacheKey = `${CACHE_KEY}_${page}_${page_size}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { products, subProducts, services } = JSON.parse(cachedData);
      allProducts = products;
      allSubProducts = subProducts;
      allServices = services;
    } else {
      // Cargar productos (categorías) de una sola vez
      const productsResponse = await ProductDataService.getAll(null);
      const subProductsResponse = await ProductDataService.getAllSubProduct(null, page, page_size);
      const servicesResponse = await ProductDataService.getAllServices(null);

      console.log("Respuesta de productos:", productsResponse.data);
      console.log("Respuesta de subproductos:", subProductsResponse.data);
      console.log("Respuesta de servicios:", servicesResponse.data);

      allProducts = productsResponse.data.results || productsResponse.data;
      allSubProducts = subProductsResponse.data.results || [];
      allServices = servicesResponse.data;

      const dataToCache = { products: allProducts, subProducts: allSubProducts, services: allServices };
      const totalSize = new TextEncoder().encode(JSON.stringify(dataToCache)).length;
      const maxSize = 1 * 1024 * 1024;

      if (totalSize < maxSize) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        } catch (e) {
          console.warn("Failed to cache data in localStorage:", e);
        }
      } else {
        console.warn("Data chunk too large to cache in localStorage.");
      }
    }

    return { allProducts, allSubProducts, allServices };
  } catch (e) {
    console.error("Error detallado al obtener datos:", {
      message: e.message,
      stack: e.stack,
      response: e.response ? {
        status: e.response.status,
        data: e.response.data,
      } : null,
    });
    toast.error("Error al cargar datos. Intenta de nuevo.");
    return { allProducts: [], allSubProducts: [], allServices: [] };
  }
};

export { normalizeString, clearOldCache, fetchProducts };