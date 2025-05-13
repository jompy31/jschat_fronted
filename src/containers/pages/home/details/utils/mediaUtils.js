import config from "../../../../../config/enviroments.ts";
import Publicidad from "../../../../../assets/catalogo/webp/visibilidad.webp";

export const getMediaUrl = (path) => {
  if (!path) return Publicidad;
  if (path.startsWith("http")) return path;
  return `${config.API_URL}${path}`;
};
