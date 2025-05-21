import React, { useEffect } from "react";
import { Form } from "react-bootstrap";
import Flag from "react-world-flags";
import Fuse from "fuse.js";
import directions from "../direction.json";
import { directions1, CHUNK_SIZE } from "../constants";
import Formulario_directorio from "../../../../../components/forms/Formulario_directorio";

// Natural sort function to handle strings with embedded numbers
const naturalSort = (a, b) => {
  const re = /(\d+)/g;
  const aParts = a.split(re);
  const bParts = b.split(re);

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    if (i % 2 === 0) {
      // Compare non-numeric parts lexicographically
      if (aParts[i] !== bParts[i]) {
        return aParts[i].localeCompare(bParts[i]);
      }
    } else {
      // Compare numeric parts numerically
      const aNum = parseInt(aParts[i], 10);
      const bNum = parseInt(bParts[i], 10);
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    }
  }
  return aParts.length - bParts.length;
};

// Normalize string function for consistent text processing
const normalizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const SearchForm = ({
  selectedDirectory,
  vibrate,
  handleButtonClick,
  isMobile,
  searchTerm,
  handleSearchTermChange,
  selectedCountry,
  setSelectedCountry,
  selectedProvince,
  setSelectedProvince,
  selectedCanton,
  setSelectedCanton,
  selectedDistrict,
  setSelectedDistrict,
  selectedService,
  setSelectedService,
  allServices,
  handleNavbarItemClick,
  updatedSubProducts,
  handleSearch,
  handleFormSubmit,
  clearOldCache,
  subproducts,
  services,
  setUpdatedSubProducts,
  setAllServices,
  hasProcessedProps,
  fetchProducts,
  categories,
  selectedCategory,
  setSelectedCategory,
  clearFilters,
  setSelectedDirectory,
  setSelectedComercialActivity,
  setSearchTerm,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedSubsubcategory,
  setSelectedSubsubcategory,
}) => {
  // Fuse.js configuration for subproducts
  const subproductFuse = new Fuse(subproducts, {
    keys: [
      "name",
      "comercial_activity",
      "province",
      "canton",
      "distrito",
      "address",
      "contact_name",
      "email",
      "category",
      "subcategory",
      "subsubcategory",
    ],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(obj[path]),
  });

  // Fuse.js configuration for services
  const serviceFuse = new Fuse(services, {
    keys: ["name", "category", "subcategory", "subsubcategory", "description"],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(obj[path]),
  });

  // Handle search term change with Fuse.js
  const handleSearchTermChangeWithFuse = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchTermChange(e); // Call original handler to maintain existing behavior

    if (value && subproducts.length > 0) {
      const normalizedQuery = normalizeString(value);

      // Search subproducts directly
      const subproductResults = subproductFuse
        .search(normalizedQuery)
        .map((result) => result.item);

      // Search services and find related subproducts
      const serviceResults = serviceFuse.search(normalizedQuery);
      const relatedSubproductIds = new Set();
      serviceResults.forEach((serviceResult) => {
        if (serviceResult.item.subproduct) {
          relatedSubproductIds.add(serviceResult.item.subproduct);
        }
      });
      const serviceRelatedSubproducts = subproducts.filter((subproduct) =>
        relatedSubproductIds.has(subproduct.id)
      );

      // Combine results, avoiding duplicates
      const combinedResults = [
        ...subproductResults,
        ...serviceRelatedSubproducts.filter(
          (subproduct) =>
            !subproductResults.some((result) => result.id === subproduct.id)
        ),
      ];

      // Update updatedSubProducts with the filtered results
      setUpdatedSubProducts(combinedResults);
    } else {
      // If no search term, reset to all subproducts
      setUpdatedSubProducts(subproducts);
    }
  };

  // Parse and extract unique categories
  const parseCategories = (categoryString) => {
    if (!categoryString || typeof categoryString !== "string") return [];
    return categoryString
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat !== "");
  };

  // Filter subcategories based on selected category
  const filteredSubcategories = selectedCategory
    ? [
        ...new Set(
          updatedSubProducts
            .filter((distributor) =>
              (distributor.productNames || []).some(
                (name) => normalizeString(name) === normalizeString(selectedCategory)
              )
            )
            .flatMap((distributor) => parseCategories(distributor?.subcategory))
        ),
      ]
        .filter((subcategory) => subcategory !== undefined && subcategory !== null && subcategory !== "")
        .sort(naturalSort)
    : [];

  // Filter subsubcategories based on selected subcategory
  const filteredSubsubcategories = selectedCategory && selectedSubcategory
    ? [
        ...new Set(
          updatedSubProducts
            .filter((distributor) =>
              (distributor.productNames || []).some(
                (name) => normalizeString(name) === normalizeString(selectedCategory)
              ) &&
              parseCategories(distributor?.subcategory).some(
                (subcat) => normalizeString(subcat) === normalizeString(selectedSubcategory)
              )
            )
            .flatMap((distributor) => parseCategories(distributor?.subsubcategory))
        ),
      ]
        .filter((subsubcategory) => subsubcategory !== undefined && subsubcategory !== null && subsubcategory !== "")
        .sort(naturalSort)
    : [];

  // Reset subcategory and subsubcategory when category changes
  useEffect(() => {
    setSelectedSubcategory(null);
    setSelectedSubsubcategory(null);
  }, [selectedCategory, setSelectedSubcategory, setSelectedSubsubcategory]);

  // Reset subsubcategory when subcategory changes
  useEffect(() => {
    setSelectedSubsubcategory(null);
  }, [selectedSubcategory, setSelectedSubsubcategory]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "white",
        zIndex: 999,
        maxWidth: "100%",
        margin: "0 auto",
        padding: "20px",
        borderRadius: "10px",
        zoom: "80%",
      }}
    >
      <Formulario_directorio />
      <Form
        onSubmit={(e) => handleFormSubmit(e)}
        style={{
          width: "60%",
          margin: "0 auto",
          backgroundColor: "#f2f2f2",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div
          className="buttonContainerStyle"
          style={{
            width: isMobile ? "50%" : "auto",
            margin: isMobile ? "0 auto" : "",
            textAlign: isMobile ? "center" : "",
          }}
        >
          <button
            className={`buttonStyle1 ${
              selectedDirectory === "comercios" && vibrate ? "logo-vibrating" : ""
            } ${selectedDirectory === "comercios" ? "selectedButton" : ""}`}
            onClick={() => handleButtonClick("comercios")}
            style={isMobile ? { fontSize: isMobile ? "0.6em" : "1em", padding: "5px" } : {}}
          >
            Directorio de Comercios
          </button>
          <button
            className={`buttonStyle1 ${
              selectedDirectory === "cooperativas" && vibrate ? "logo-vibrating" : ""
            } ${selectedDirectory === "cooperativas" ? "selectedButton" : ""}`}
            onClick={() => handleButtonClick("cooperativas")}
            style={isMobile ? { fontSize: isMobile ? "0.6em" : "1em", padding: "5px" } : {}}
          >
            Directorio de Cooperativas
          </button>
          <button
            className={`buttonStyle1 ${
              selectedDirectory === "asociaciones" && vibrate ? "logo-vibrating" : ""
            } ${selectedDirectory === "asociaciones" ? "selectedButton" : ""}`}
            onClick={() => handleButtonClick("asociaciones")}
            style={isMobile ? { fontSize: isMobile ? "0.6em" : "1em", padding: "5px" } : {}}
          >
            Directorio de Asociaciones
          </button>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                colSpan="2"
                style={{
                  fontSize: isMobile ? "1.2em" : "2em",
                  color: "red",
                  textShadow: "2px 2px 2px #000",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "2px solid #ccc",
                  padding: "10px",
                }}
              >
                {selectedDirectory === "comercios" && <span>Buscar en Directorio de Comercios:</span>}
                {selectedDirectory === "cooperativas" && <span>Buscar en Directorio de Cooperativas:</span>}
                {selectedDirectory === "asociaciones" && <span>Buscar en Directorio de Asociaciones:</span>}
                {!selectedDirectory && <span>Buscar en Directorio General:</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2">
                <input
                  type="text"
                  placeholder="Busque aqui su contacto por nombre, provincia o municipio, distrito, servicio..."
                  value={searchTerm}
                  onChange={handleSearchTermChangeWithFuse}
                  className="border-0 text-black"
                  style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ padding: "8px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  <div style={{ background: "#f2f2f2", padding: "8px" }}>
                    <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>País:</label>
                    <div
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        onClick={() => setSelectedCountry("")}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: selectedCountry === "" ? "green" : "transparent",
                          color: selectedCountry === "" ? "white" : "black",
                        }}
                      >
                        Seleccione el País
                      </div>
                      {directions && Object.keys(directions).length > 0 ? (
                        Object.keys(directions1).map((country) => (
                          <div
                            key={country}
                            onClick={() => setSelectedCountry(country)}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: selectedCountry === country ? "green" : "transparent",
                              color: selectedCountry === country ? "white" : "black",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Flag code={directions1[country]} style={{ width: "24px", height: "16px", marginRight: "8px" }} />
                            {country}
                          </div>
                        ))
                      ) : (
                        <p>No hay países disponibles.</p>
                      )}
                    </div>
                  </div>
                  <div style={{ background: "#e6e6e6", padding: "8px" }}>
                    <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>Provincia:</label>
                    <div
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        onClick={() => {
                          setSelectedProvince("");
                          setSelectedCanton("");
                          setSelectedDistrict("");
                        }}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: selectedProvince === "" ? "green" : "transparent",
                          color: selectedProvince === "" ? "white" : "black",
                        }}
                      >
                        No importa
                      </div>
                      {selectedCountry &&
                        directions[selectedCountry] &&
                        Object.keys(directions[selectedCountry].provincias).map((province) => (
                          <div
                            key={province}
                            onClick={() => {
                              setSelectedProvince(province);
                              setSelectedCanton("");
                              setSelectedDistrict("");
                            }}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: selectedProvince === province ? "green" : "transparent",
                              color: selectedProvince === province ? "white" : "black",
                            }}
                          >
                            {province}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div style={{ background: "#f2f2f2", padding: "8px" }}>
                    <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>Cantón:</label>
                    <div
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        onClick={() => {
                          setSelectedCanton("");
                          setSelectedDistrict("");
                        }}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: selectedCanton === "" ? "green" : "transparent",
                          color: selectedCanton === "" ? "white" : "black",
                        }}
                      >
                        No importa
                      </div>
                      {selectedProvince &&
                        directions[selectedCountry]?.provincias[selectedProvince]?.cantones &&
                        Object.keys(directions[selectedCountry].provincias[selectedProvince].cantones).map((canton) => (
                          <div
                            key={canton}
                            onClick={() => {
                              setSelectedCanton(canton);
                              setSelectedDistrict("");
                            }}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              backgroundColor: selectedCanton === canton ? "green" : "transparent",
                              color: selectedCanton === canton ? "white" : "black",
                            }}
                          >
                            {canton}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div style={{ background: "#e6e6e6", padding: "8px" }}>
                    <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>Distrito:</label>
                    <div
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        onClick={() => setSelectedDistrict("")}
                        style={{
                          padding: "8px",
                          cursor: "pointer",
                          backgroundColor: selectedDistrict === "" ? "green" : "transparent",
                          color: selectedDistrict === "" ? "white" : "black",
                        }}
                      >
                        No importa
                      </div>
                      {selectedCanton &&
                        directions[selectedCountry]?.provincias[selectedProvince]?.cantones[selectedCanton]?.distritos.map(
                          (district, index) => (
                            <div
                              key={district}
                              onClick={() => setSelectedDistrict(district)}
                              style={{
                                padding: "8px",
                                cursor: "pointer",
                                backgroundColor: selectedDistrict === district ? "green" : "transparent",
                                color: selectedDistrict === district ? "white" : "black",
                              }}
                            >
                              {district}
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ width: "50%", background: "#f2f2f2", padding: "8px" }}>
                <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>
                  Servicio o Producto:
                </label>
              </td>
              <td style={{ width: "50%", background: "#f2f2f2", padding: "8px" }}>
                <select
                  onChange={(e) => {
                    const selectedIndex = e.target.selectedIndex - 1;
                    setSelectedService(selectedIndex >= 0 ? allServices[selectedIndex] : null);
                  }}
                  value={selectedService ? `${selectedService.name}` : ""}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">No importa</option>
                  {Array.from(new Set(allServices.map((service) => `${service?.name}`)))
                    .filter((service) => service !== undefined && service !== null && service !== "")
                    .map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ width: "50%", background: "#e6e6e6", padding: "8px" }}>
                <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>
                  Categoría:
                </label>
              </td>
              <td style={{ width: "50%", background: "#e6e6e6", padding: "8px" }}>
                <select
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  value={selectedCategory || ""}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">No importa</option>
                  {categories
                    .filter((category) => category !== undefined && category !== null && category !== "")
                    .sort(naturalSort)
                    .map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ width: "50%", background: "#f2f2f2", padding: "8px" }}>
                <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>
                  Subcategoría:
                </label>
              </td>
              <td style={{ width: "50%", background: "#f2f2f2", padding: "8px" }}>
                <select
                  onChange={(e) => setSelectedSubcategory(e.target.value || null)}
                  value={selectedSubcategory || ""}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">No importa</option>
                  {filteredSubcategories.map((subcategory, index) => (
                    <option key={index} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ width: "50%", background: "#e6e6e6", padding: "8px" }}>
                <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>
                  Subsubcategoría:
                </label>
              </td>
              <td style={{ width: "50%", background: "#e6e6e6", padding: "8px" }}>
                <select
                  onChange={(e) => setSelectedSubsubcategory(e.target.value || null)}
                  value={selectedSubsubcategory || ""}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">No importa</option>
                  {filteredSubsubcategories.map((subsubcategory, index) => (
                    <option key={index} value={subsubcategory}>
                      {subsubcategory}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td style={{ width: "50%", background: "#e6e6e6", padding: "8px" }}>
                <label style={{ marginRight: "5px", display: "block", textAlign: "right" }}>
                  Actividad Comercial:
                </label>
              </td>
              <td style={{ width: "50%", background: "#e6e6e6", padding: "8px" }}>
                <select
                  onChange={(e) => handleNavbarItemClick(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <option value="">No importa</option>
                  {[...new Set(updatedSubProducts.map((distributor) => distributor?.comercial_activity))]
                    .filter((activity) => activity !== undefined && activity !== null && activity !== "")
                    .sort(naturalSort)
                    .map((activity, index) => (
                      <option key={index} value={activity}>
                        {activity}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: "center", padding: "10px" }}>
                <button onClick={handleSearch} className="search-button1" style={{ padding: "10px 20px" }}>
                  Buscar
                </button>
                <button
                  onClick={() => {
                    setSelectedCountry("");
                    setSelectedProvince("");
                    setSelectedCanton("");
                    setSelectedDistrict("");
                    setSelectedService(null);
                    setSearchTerm("");
                    setSelectedDirectory("");
                    setSelectedComercialActivity("");
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSelectedSubsubcategory(null);
                    clearFilters();
                    clearOldCache();
                    handleSearch();
                  }}
                  className="delete-button"
                >
                  Borrar Filtros
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
    </div>
  );
};

export default SearchForm;