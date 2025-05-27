import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CostaRica from "../../../components/json/costarica.json";
import ProductDataService from "../../../services/products";
import logo from "../../../assets/categorias/25.webp"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./VisualizacionTurismo.css";
import PropertyModal from "./22modal.js";
import { useMediaQuery } from "react-responsive";

const CustomIcon = L.divIcon({
  className: "custom-icon",
  html: `<div style="color: red; font-size: 24px;"><i class="fa fa-map-marker"></i></div>`,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
});

const ComerciosAfiliados = ({ subproducts }) => {
  const token = useSelector((state) => state.authentication.token);

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [country, setCountry] = useState("Costa Rica");
  const [province, setProvince] = useState("");
  const [canton, setCanton] = useState("");
  const [provinces, setProvinces] = useState(CostaRica.Costa_Rica.Provinces);
  const [cantons, setCantons] = useState([]);
  const [position, setPosition] = useState([9.9281, -84.0907]);
  const [visibleIframes, setVisibleIframes] = useState({});
  const [propertyTypeSelected, setPropertyTypeSelected] = useState("");
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [totalItems, setTotalItems] = useState(0); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const pageSize = 8; 
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  useEffect(() => {
    transformProperties();
  }, [subproducts]);

  useEffect(() => {
    filterProperties();
  }, [country, province, canton, propertyTypeSelected, properties]);

   // Obtener subproductos del servidor
   useEffect(() => {
    fetchSubProducts();
  }, [token, currentPage]);

  const fetchSubProducts = async () => {
    try {
      const response = await ProductDataService.getPointOfSaleSubProducts(token, currentPage, pageSize);
      console.log("Server Response:", response);
      const subproducts = response.data.results || response.data;
      setTotalItems(response.data.count || 0);
      transformProperties(subproducts);
    } catch (error) {
      console.error("Error al obtener subproductos de point-of-sale:", error);
    }
  };

  const transformProperties = (subproducts) => {
    try {
      const filteredSubproducts = subproducts.filter((subproduct) => subproduct); // Filtrar subproductos válidos
      console.log("Input Subproducts:", subproducts);
      const transformedProperties = filteredSubproducts.map((subproduct) => {
        return {
          id: subproduct.id,
          title: subproduct.name || "Sin nombre",
          description: subproduct.description || "Sin descripción",
          rating: null,
          province: subproduct.province || "Sin provincia",
          canton: subproduct.canton || "Sin cantón",
          location: subproduct.addressmap || "",
          pictures: [
            ...(subproduct.image ? [{ image: subproduct.image }] : []),
            ...(subproduct.logo ? [{ image: subproduct.logo }] : []),
          ], // Incluir image y logo
          property_type: subproduct.comercial_activity || "Sin actividad",
          bedrooms: null,
          bathrooms: null,
          price_per_night: null,
          contact_name: subproduct.contact_name || "Sin contacto",
          phone: subproduct.phone || "Sin teléfono",
          country: subproduct.country || "Costa Rica",
          url: subproduct.url || "#",
        };
      });
      setProperties(transformedProperties);
      console.log("Transformed Properties:", transformedProperties);
    } catch (error) {
      console.error("Error al transformar los subproductos:", error);
    }
  };
  const getCoordinatesFromLocation = (location) => {
    const regex =
      /!1m12!1m3!1d[^!]*!2d([-+]?[0-9]*\.?[0-9]+)!3d([-+]?[0-9]*\.?[0-9]+)/;
    const match = location.match(regex);
    if (match) {
      const latitude = parseFloat(match[2]);
      const longitude = parseFloat(match[1]);
      return [latitude, longitude];
    }
    return null;
  };

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
  };

  const filterProperties = () => {
  let filtered = properties;

  // Filtrar por país
  if (country) {
    filtered = filtered.filter(
      (property) =>
        normalizeText(property.country) === normalizeText(country)
    );
  }

  // Filtrar por provincia
  if (province) {
    filtered = filtered.filter(
      (property) =>
        normalizeText(property.province) === normalizeText(province)
    );
  }

  // Filtrar por cantón
  if (canton) {
    filtered = filtered.filter(
      (property) =>
        normalizeText(property.canton) === normalizeText(canton)
    );
  }

  // Filtrar por tipo de propiedad (si aplica)
  if (propertyTypeSelected) {
    filtered = filtered.filter(
      (property) =>
        normalizeText(property.property_type) ===
        normalizeText(propertyTypeSelected)
    );
  }

  setFilteredProperties(filtered);
  console.log("Filtered Properties:", filtered); // Para depuración
};

  const handlePropertyTypeClick = (type) => {
    if (propertyTypeSelected === type) {
      setPropertyTypeSelected("");
    } else {
      setPropertyTypeSelected(type);
    }
  };

  const handleViewAllClick = () => {
    setCountry("Costa Rica");
    setProvince("");
    setCanton("");
    setPropertyTypeSelected("");
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    if (selectedCountry === "Costa Rica") {
      setProvinces(CostaRica.Costa_Rica.Provinces);
    } else {
      setProvinces([]);
      setProvince("");
      setCantons([]);
    }
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);

    const provinceData = provinces.find((p) => p.name === selectedProvince);
    if (provinceData) {
      setCantons(provinceData.cantons);
    } else {
      setCantons([]);
    }
  };

  const handleCantonChange = (e) => {
    const selectedCanton = e.target.value;
    setCanton(selectedCanton);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const toggleIframeVisibility = (propertyId) => {
    setVisibleIframes((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleImageChange = (propertyId, change) => {
    setCurrentImageIndices((prev) => {
      const currentProperty = properties.find((p) => p.id === propertyId);
      const images = Array.isArray(currentProperty?.pictures) ? currentProperty.pictures : [];
      const currentIndex = prev[propertyId] || 0;
      const newIndex = Math.max(
        0,
        Math.min(
          currentIndex + change,
          images.length - 1
        )
      );
      return { ...prev, [propertyId]: newIndex };
    });
  };

  const handlePropertyClick = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <div className="visualizacion-turismo" style={{ height: "100%", marginTop: isMini ? "30%" : isMobile ? "25%" : "7%", zoom: isMini ? "60%" : "80%" }}>
      <h1><strong>Comercios Afiliados en Costa Rica</strong></h1>
      
      <div className="content-container">
        <div className="map-container">
          <div className="filters">
            <div className="filter">
              <label>País:</label>
              <select
                value={country}
                onChange={handleCountryChange}
                className="filter-input"
              >
                <option value="">Seleccionar país</option>
                <option value="Costa Rica">Costa Rica</option>
              </select>
            </div>

            <div className="filter">
              <label>Provincia:</label>
              <select
                value={province}
                onChange={handleProvinceChange}
                className="filter-input"
              >
                <option value="">Seleccionar provincia</option>
                {provinces.map((prov, index) => (
                  <option key={index} value={prov.name}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter">
              <label>Cantón:</label>
              <select
                value={canton}
                onChange={handleCantonChange}
                className="filter-input"
              >
                <option value="">Seleccionar cantón</option>
                {cantons.length > 0
                  ? cantons.map((cantonName, index) => (
                      <option key={index} value={cantonName}>
                        {cantonName}
                      </option>
                    ))
                  : properties.map((property, index) => (
                      <option key={index} value={property.canton}>
                        {property.canton}
                      </option>
                    ))}
              </select>
            </div>
          </div>
          <MapContainer
            center={position}
            zoom={7}
            style={{ 
              height: isMini ? "30%" : "100%", 
              width: "100%", 
              zoom: isMini ? "40%" : "100%" 
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredProperties.map((property) => {
              const coords = getCoordinatesFromLocation(property.location);
              return coords ? (
                <Marker key={property.id | 0} position={coords} icon={CustomIcon}>
                  <Popup>
                    <strong>{property.title}</strong>
                    <br />
                    {property.property_type}
                  </Popup>
                </Marker>
              ) : null;
            })}
          </MapContainer>
        </div>

        <div className="properties-list" style={{ marginTop: isMini ? "18%" : isMobile ? "10%" : "7%" }}>
          {currentProperties.map((property) => {
            const currentIndex = currentImageIndices[property.id] || 0;
            const images = Array.isArray(property.pictures) ? property.pictures : [];
            const isValidIndex = images.length > 0 && currentIndex < images.length;

            // Log image URLs for debugging
            console.log(`Property: ${property.title}, Image URL: ${isValidIndex ? images[currentIndex].image : "No image"}`);

            return (
              <div className="property-card" key={property.id} onClick={() => window.location.href = property.url}>
                <div className="image-carousel">
                  {isValidIndex ? (
                    <img
                      src={images[currentIndex].image}
                      alt={`Imagen de ${property.title}`}
                      onError={(e) => {
                        console.error(`Failed to load image for ${property.title}: ${images[currentIndex].image}`);
                        e.target.src = logo;
                      }}
                      className="property-image"
                    />
                  ) : (
                    <img
                    src={logo}
                      alt="Sin imagen disponible"
                      className="property-image"
                    />
                  )}
                  {images.length > 1 && (
                    <>
                      <button
                        className="carousel-button prev"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageChange(property.id, -1);
                        }}
                        disabled={currentIndex === 0}
                      >
                        ❮
                      </button>
                      <button
                        className="carousel-button next"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageChange(property.id, 1);
                        }}
                        disabled={currentIndex >= images.length - 1}
                      >
                        ❯
                      </button>
                    </>
                  )}
                </div>
                <div className="property-detalles">
                  <div className="title-rating-container">
                    <h4><strong>{truncateText(property.title, 30)}</strong></h4>
                    {property.rating && <p className="rating">★{property.rating}</p>}
                  </div>
                  <div className="descriptionSlider">
                    <p>{truncateText(property.description, 100)}</p>
                  </div>
                  <div className="property-info">
                    <p><strong>{property.property_type}</strong></p>
                    <p><strong>Provincia:</strong> {property.province}</p>
                    <p><strong>Cantón:</strong> {property.canton || "Sin especificar"}</p>
                    <p><strong>Contacto:</strong> {property.contact_name || "Sin especificar"}</p>
                    <p><strong>Teléfono:</strong> {property.phone || "Sin especificar"}</p>
                    {property.price_per_night && (
                      <p className="price"><strong>Precio:</strong> ₡{property.price_per_night}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>

      {isModalOpen && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default ComerciosAfiliados;