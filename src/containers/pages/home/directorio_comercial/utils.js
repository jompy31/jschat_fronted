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

const fetchProducts = async (start = 0, limit = CHUNK_SIZE) => {
  try {
    let allSubProducts = [];
    let allServices = [];

    const cacheKey = `${CACHE_KEY}_${start}_${limit}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { subProducts, services } = JSON.parse(cachedData);
      allSubProducts = subProducts;
      allServices = services;
    } else {
      const subProductsResponse = await ProductDataService.getAllSubProduct({
        start,
        limit,
      });
      const servicesResponse = await ProductDataService.getAllServices({
        start,
        limit,
      });

      console.log("Respuesta de subproductos:", subProductsResponse.data);
      console.log("Respuesta de servicios:", servicesResponse.data);

      allSubProducts = subProductsResponse.data;
      allServices = servicesResponse.data;

      const dataToCache = { subProducts: allSubProducts, services: allServices };
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

    return { allSubProducts, allServices };
  } catch (e) {
    console.error("Error detallado al obtener subproductos o servicios:", {
      message: e.message,
      stack: e.stack,
      response: e.response ? {
        status: e.response.status,
        data: e.response.data,
      } : null,
    });
    toast.error("Error al cargar datos. Intenta de nuevo.");
    return { allSubProducts: [], allServices: [] };
  }
};

export { normalizeString, clearOldCache, fetchProducts };