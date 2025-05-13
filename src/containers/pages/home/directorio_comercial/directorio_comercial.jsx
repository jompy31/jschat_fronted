import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Fuse from "fuse.js";
import "./distributors.css";
import { useInterval } from "./hooks";
import { normalizeString, clearOldCache, fetchProducts } from "./utils";
import { CHUNK_SIZE } from "./constants";
import LoadingSpinner from "./components/LoadingSpinner";
import LetterLoadingMessage from "./components/LetterLoadingMessage";
import DistributorTable from "./components/DistributorTable";
import SearchForm from "./components/SearchForm";

function Distributors({ products = [], subproducts = [], services = [], selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory, selectedSubsubcategory, setSelectedSubsubcategory, clearFilters }) {
  const [distributors, setDistributors] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedComercialActivity, setSelectedComercialActivity] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allDistributors, setAllDistributors] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [isLetterLoading, setIsLetterLoading] = useState(false);
  const [updatedSubProducts, setUpdatedSubProducts] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vibrate, setVibrate] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const listRef = useRef(null);
  const hasProcessedProps = useRef(false);

  useEffect(() => {
    const processData = async () => {
      console.log("Productos recibidos:", products);
      console.log("Subproductos recibidos:", subproducts);
      console.log("Servicios recibidos:", services);

      if (!products.length && !subproducts.length) {
        console.log("Productos y subproductos vacíos, esperando datos de home.jsx...");
        return;
      }

      if (hasProcessedProps.current) {
        console.log("Props ya procesados, omitiendo...");
        return;
      }

      setIsLoading(true);
      try {
        let finalSubProducts = subproducts;
        let finalServices = services;

        if (!Array.isArray(subproducts) || subproducts.length === 0) {
          console.log("Subproductos vacíos, obteniendo datos...");
          const { allSubProducts, allServices } = await fetchProducts(0, CHUNK_SIZE);
          finalSubProducts = allSubProducts;
          finalServices = allServices;
        }

        if (!Array.isArray(finalSubProducts) || !Array.isArray(finalServices)) {
          console.error("Datos inválidos:", { finalSubProducts, finalServices });
          toast.error("Error: Datos inválidos recibidos.");
          setUpdatedSubProducts([]);
          setAllServices([]);
          setCategories([]);
          return;
        }

        const productMap = products.reduce((acc, product) => {
          acc[product.id] = product.name || `Producto ${product.id}`;
          return acc;
        }, {});

        const allCategories = products
          .map((product) => product.name)
          .filter((name) => name && typeof name === "string")
          .sort((a, b) => a.localeCompare(b));

        setCategories([...new Set(allCategories)]);

        const servicesBySubproduct = finalServices.reduce((acc, service) => {
          const subproductId = service?.subproduct;
          if (subproductId) {
            if (!acc[subproductId]) acc[subproductId] = [];
            acc[subproductId].push(service);
          }
          return acc;
        }, {});

        const updated = finalSubProducts.map((subProduct) => {
          const productNames = (subProduct.products || []).map((productId) => productMap[productId] || productId);
          return {
            ...subProduct,
            services: servicesBySubproduct[subProduct?.id] || [],
            productNames,
          };
        });

        console.log("Subproductos procesados:", updated.map(d => ({
          id: d.id,
          name: d.name,
          productNames: d.productNames,
          subcategory: d.subcategory,
          subsubcategory: d.subsubcategory,
        })));
        setUpdatedSubProducts(updated);
        setAllServices(finalServices);
        hasProcessedProps.current = true;
      } catch (e) {
        console.error("Error al procesar datos:", e);
        toast.error("Error al procesar datos. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    processData();
  }, [products, subproducts, services]);

  useInterval(() => {
    setVibrate(true);
    setTimeout(() => {
      setVibrate(false);
    }, 200);
  }, 4000);

  const fetchDistributors = useCallback(() => {
    if (!updatedSubProducts.length) {
      console.log("No hay subproductos para filtrar");
      setAllDistributors([]);
      setDistributors([]);
      return;
    }

    console.log("Filtrando con:", {
      selectedCategory,
      selectedSubcategory,
      selectedSubsubcategory,
      selectedCountry,
      selectedProvince,
      selectedCanton,
      selectedDistrict,
      selectedDirectory,
      selectedComercialActivity,
      selectedService,
    });

    const filtered = updatedSubProducts.filter((distributor) => {
      const matchesService = selectedService
        ? distributor.services?.some(
            (service) =>
              service?.id === selectedService?.id ||
              normalizeString(service?.name) === normalizeString(selectedService?.name)
          )
        : true;

      const productNames = Array.isArray(distributor?.productNames) ? distributor.productNames : [];

      const matchesCategory = selectedCategory
        ? productNames.some((name) => normalizeString(name) === normalizeString(selectedCategory))
        : true;

      const matchesSubcategory = selectedSubcategory
        ? normalizeString(distributor?.subcategory || "") === normalizeString(selectedSubcategory)
        : true;

      const matchesSubsubcategory = selectedSubsubcategory
        ? normalizeString(distributor?.subsubcategory || "") === normalizeString(selectedSubsubcategory)
        : true;

      const matches = (
        (!selectedCountry || normalizeString(distributor?.country || "") === normalizeString(selectedCountry)) &&
        (!selectedProvince || normalizeString(distributor?.province || "") === normalizeString(selectedProvince)) &&
        (!selectedCanton || normalizeString(distributor?.canton || "") === normalizeString(selectedCanton)) &&
        (!selectedDistrict || normalizeString(distributor?.distrito || "") === normalizeString(selectedDistrict)) &&
        (selectedDirectory === "comercios"
          ? !(distributor.products || []).includes(19)
          : selectedDirectory === "cooperativas"
          ? (distributor.products || []).includes(19)
          : selectedDirectory === "asociaciones"
          ? (distributor.products || []).includes(25)
          : true) &&
        (!selectedComercialActivity ||
          normalizeString(distributor?.comercial_activity || "") === normalizeString(selectedComercialActivity)) &&
        matchesService &&
        matchesCategory &&
        matchesSubcategory &&
        matchesSubsubcategory
      );

      return matches;
    });

    console.log("Subproductos filtrados:", filtered.map(d => ({
      id: d.id,
      name: d.name,
      productNames: d.productNames,
      subcategory: d.subcategory,
      subsubcategory: d.subsubcategory,
    })));

    let sorted = Array.from(
      new Map(filtered.map((distributor) => [distributor.id, distributor])).values()
    ).sort((a, b) =>
      normalizeString(a?.name || "").localeCompare(normalizeString(b?.name || ""))
    );

    setAllDistributors(sorted);
    setDistributors(sorted);
  }, [
    updatedSubProducts,
    selectedCountry,
    selectedProvince,
    selectedCanton,
    selectedDistrict,
    selectedDirectory,
    selectedComercialActivity,
    selectedService,
    selectedCategory,
    selectedSubcategory,
    selectedSubsubcategory,
  ]);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const handleButtonClick = (directory) => {
    setSelectedDirectory(directory);
    fetchDistributors();
    setVibrate(true);
    setTimeout(() => {
      setVibrate(false);
    }, 4000);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setFilteredDistributors(allDistributors);
  }, [allDistributors]);

  const handleSearch = () => {
    if (!searchTerm) {
      const results = allDistributors.filter((distributor) => {
        const matchesService = selectedService
          ? distributor.Services?.some(
              (service) =>
                service?.id === selectedService?.id ||
                normalizeString(service?.name) === normalizeString(selectedService?.name)
          )
        : true;
        const matchesCategory = selectedCategory
          ? (distributor.productNames || []).some(
              (name) => normalizeString(name) === normalizeString(selectedCategory)
            )
          : true;
        const matchesSubcategory = selectedSubcategory
          ? normalizeString(distributor?.subcategory || "") === normalizeString(selectedSubcategory)
          : true;
        const matchesSubsubcategory = selectedSubsubcategory
          ? normalizeString(distributor?.subsubcategory || "") === normalizeString(selectedSubsubcategory)
          : true;
        return matchesService && matchesCategory && matchesSubcategory && matchesSubsubcategory;
      });
      console.log("Resultados sin búsqueda de texto:", results.map(d => ({
        id: d.id,
        name: d.name,
        subcategory: d.subcategory,
        subsubcategory: d.subsubcategory,
      })));
      setFilteredDistributors(results);
    } else {
      const fuse = new Fuse(allDistributors, {
        keys: [
          "name",
          "country",
          "address",
          "phone_number",
          "province",
          "canton",
          "comercial_activity",
          "email",
          "services.name",
          "productNames",
          "subcategory",
          "subsubcategory",
        ],
        threshold: 0.3,
        includeScore: true,
        getFn: (obj, path) => {
          const value = Fuse.config.getFn(obj, path);
          return normalizeString(value);
        },
      });
      const results = fuse.search(normalizeString(searchTerm)).map((result) => result.item);

      const filteredResults = results.filter((distributor) => {
        const matchesService = selectedService
          ? distributor.services?.some(
              (service) =>
                service?.id === selectedService?.id ||
                normalizeString(service?.name) === normalizeString(selectedService?.name)
            )
          : true;
        const matchesCategory = selectedCategory
          ? (distributor.productNames || []).some(
              (name) => normalizeString(name) === normalizeString(selectedCategory)
            )
          : true;
        const matchesSubcategory = selectedSubcategory
          ? normalizeString(distributor?.subcategory || "") === normalizeString(selectedSubcategory)
          : true;
        const matchesSubsubcategory = selectedSubsubcategory
          ? normalizeString(distributor?.subsubcategory || "") === normalizeString(selectedSubsubcategory)
          : true;
        return matchesService && matchesCategory && matchesSubcategory && matchesSubsubcategory;
      });

      console.log("Resultados con búsqueda de texto:", filteredResults.map(d => ({
        id: d.id,
        name: d.name,
        subcategory: d.subcategory,
        subsubcategory: d.subsubcategory,
      })));
      setFilteredDistributors(filteredResults);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const filteredByCanton = distributors.filter((distributor) => {
      return (
        distributor &&
        distributor.canton &&
        normalizeString(distributor.canton) === normalizeString(selectedCanton)
      );
    });
    setDistributors(filteredByCanton);
  };

  const sortedDistributors = filteredDistributors;

  const handleNavbarItemClick = (comercialActivity) => {
    setSelectedComercialActivity(comercialActivity);
  };

  const handleLetterClick = (letter) => {
    setIsLetterLoading(true);
    const targetIndex = sortedDistributors.findIndex(
      (distributor) =>
        distributor?.name &&
        normalizeString(distributor.name).startsWith(normalizeString(letter))
    );

    if (targetIndex === -1) {
      setTimeout(() => {
        setIsLetterLoading(false);
        toast.info(`No hay comercios que comiencen con la letra ${letter}.`);
      }, 1000);
      return;
    }

    const columnIndex = Math.floor(targetIndex / 20);
    const rowIndex = Math.floor(columnIndex / 4);

    if (listRef.current) {
      listRef.current.scrollToRow(rowIndex);
      setIsLetterLoading(false);
    }
  };

  return (
    <main
      style={{
        width: "100%",
        marginTop: isMini ? "40%" : "7%",
        zoom: isMobile ? "40%" : isMini ? "30%" : "100%",
      }}
    >
      <SearchForm
        selectedDirectory={selectedDirectory}
        vibrate={vibrate}
        handleButtonClick={handleButtonClick}
        isMobile={isMobile}
        searchTerm={searchTerm}
        handleSearchTermChange={handleSearchTermChange}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedCanton={selectedCanton}
        setSelectedCanton={setSelectedCanton}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        allServices={allServices}
        handleNavbarItemClick={handleNavbarItemClick}
        updatedSubProducts={updatedSubProducts}
        handleSearch={handleSearch}
        handleFormSubmit={handleFormSubmit}
        clearOldCache={clearOldCache}
        subproducts={subproducts}
        services={services}
        setUpdatedSubProducts={setUpdatedSubProducts}
        setAllServices={setAllServices}
        hasProcessedProps={hasProcessedProps}
        fetchProducts={fetchProducts}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        clearFilters={clearFilters}
        setSelectedDirectory={setSelectedDirectory}
        setSelectedComercialActivity={setSelectedComercialActivity}
        setSearchTerm={setSearchTerm}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        selectedSubsubcategory={selectedSubsubcategory}
        setSelectedSubsubcategory={setSelectedSubsubcategory}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : updatedSubProducts.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>No se encontraron comercios en el directorio.</p>
          <button
            onClick={() => (window.location.href = "https://abcupon.com/#/directorio_comercial")}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            style={{ lineHeight: "1.5" }}
          >
            Visita nuestro Directorio General de Comercios
          </button>
        </div>
      ) : (
        <main
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingRight: "50px",
          }}
        >
          <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "space-between" }}>
            {sortedDistributors.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <p>No se encontraron comercios que coincidan con los filtros seleccionados.</p>
                <button
                  onClick={() => (window.location.href = "https://abcupon.com/#/directorio_comercial")}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                  style={{ lineHeight: "1.5" }}
                >
                  Visita nuestro Directorio General de Comercios
                </button>
              </div>
            ) : (
              <>
                {isLetterLoading && <LetterLoadingMessage />}
                <DistributorTable sortedDistributors={sortedDistributors} listRef={listRef} />
              </>
            )}
          </div>

          <div
            style={{
              position: "fixed",
              right: "10px",
              top: "100px",
              paddingTop: "20px",
              zIndex: "99999",
              backgroundColor: "white",
              border: "2px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            {Array.from(Array(26), (_, i) => String.fromCharCode(65 + i)).map((letter) => (
              <div
                key={letter}
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: "1px",
                  textAlign: "center",
                }}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </div>
            ))}
          </div>
        </main>
      )}

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Total de Comercios en Directorio: {sortedDistributors.length}</p>
      </div>

      <br />
      <br />
    </main>
  );
}

export default Distributors;