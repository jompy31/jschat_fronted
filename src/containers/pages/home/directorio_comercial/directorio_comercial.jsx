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
import ProductDataService from "../../../../services/products";

// Natural sort function for sorting categories
const naturalSort = (a, b) => {
  const re = /(\d+)/g;
  const aParts = a.split(re);
  const bParts = b.split(re);

  for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
    if (i % 2 === 0) {
      if (aParts[i] !== bParts[i]) {
        return aParts[i].localeCompare(bParts[i]);
      }
    } else {
      const aNum = parseInt(aParts[i], 10);
      const bNum = parseInt(bParts[i], 10);
      if (aNum !== bNum) {
        return aNum - bNum;
      }
    }
  }
  return aParts.length - bParts.length;
};

function Distributors({ products: initialProducts = [], subproducts = [], services = [], selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory, selectedSubsubcategory, setSelectedSubsubcategory, clearFilters }) {
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
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [allDistributors, setAllDistributors] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [isLetterLoading, setIsLetterLoading] = useState(false);
  const [updatedSubProducts, setUpdatedSubProducts] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState(initialProducts);
  const [vibrate, setVibrate] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const listRef = useRef(null);
  const hasProcessedProps = useRef(false);
  const hasShownToast = useRef(false);

  // Cargar productos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { allProducts, allSubProducts, allServices } = await fetchProducts(1, CHUNK_SIZE);
        setProducts(allProducts);
        setUpdatedSubProducts(allSubProducts);
        setAllServices(allServices);
        setCategories(
          Array.isArray(allProducts)
            ? [...new Set(
                allProducts
                  .filter((product) => product.name && typeof product.name === "string")
                  .map((product) => product.name)
                  .sort((a, b) => a.localeCompare(b))
              )]
            : []
        );
      } catch (e) {
        console.error("Error al cargar datos iniciales:", e);
        toast.error("Error al cargar datos iniciales.");
      }
    };

    if (!initialProducts.length) {
      loadInitialData();
    } else {
      setCategories(
        Array.isArray(initialProducts)
          ? [...new Set(
              initialProducts
                .filter((product) => product.name && typeof product.name === "string")
                .map((product) => product.name)
                .sort((a, b) => a.localeCompare(b))
              )]
          : []
      );
    }
  }, [initialProducts]);

  const loadMoreSubProducts = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const response = await ProductDataService.getAllSubProduct(null, page, CHUNK_SIZE);
      const { results, next } = response.data;
      const newSubProducts = results || [];

      if (newSubProducts.length === 0 || !next) {
        setHasMore(false);
        setIsFullyLoaded(true);
      }

      const productMap = Array.isArray(products)
        ? products.reduce((acc, product) => {
            if (product.id && product.name && typeof product.name === "string") {
              acc[product.id] = product.name;
            } else {
              console.warn(`Invalid product data: ${JSON.stringify(product)}`);
            }
            return acc;
          }, {})
        : {};

      const servicesBySubproduct = Array.isArray(services)
        ? services.reduce((acc, service) => {
            const subproductId = service?.subproduct;
            if (subproductId) {
              if (!acc[subproductId]) acc[subproductId] = [];
              acc[subproductId].push(service);
            }
            return acc;
          }, {})
        : {};

      const updated = newSubProducts.map((subProduct) => {
        const productNames = (subProduct.products || []).map((productId) => {
          const name = productMap[productId];
          if (!name) {
            console.warn(`No product name found for productId: ${productId}, subProduct: ${subProduct.id}`);
            return `Unknown Product ${productId}`;
          }
          return name;
        }).filter(name => name && typeof name === "string");

        return {
          ...subProduct,
          services: servicesBySubproduct[subProduct?.id] || [],
          productNames,
        };
      });

      setUpdatedSubProducts((prev) => [...prev, ...updated]);
      setPage((prev) => prev + 1);

      console.log("Updated Subproducts:", updated.map(d => ({
        id: d.id,
        name: d.name,
        productNames: d.productNames,
      })));
    } catch (e) {
      console.error("Error al cargar subproductos:", e);
      toast.error("Error al cargar más comercios.");
      setHasMore(false);
      setIsFullyLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, products, services]);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const intervalId = setInterval(() => {
      if (hasMore && !isLoading) {
        loadMoreSubProducts();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [loadMoreSubProducts, hasMore, isLoading]);

  useEffect(() => {
    if (isFullyLoaded && !isLoading && !hasShownToast.current) {
      toast.success("Directorio cargado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      hasShownToast.current = true;
    }
  }, [isFullyLoaded, isLoading]);

  useInterval(() => {
    setVibrate(true);
    setTimeout(() => {
      setVibrate(false);
    }, 200);
  }, 4000);

  const parseCategories = (categoryString) => {
    if (!categoryString || typeof categoryString !== "string") return [];
    return categoryString
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat !== "");
  };

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
      let matchesCategory = true;
      let matchesSubcategory = true;
      let matchesSubsubcategory = true;

      if (selectedSubsubcategory) {
        const distributorSubsubcategories = parseCategories(distributor?.subsubcategory);
        matchesSubsubcategory = distributorSubsubcategories.some(
          (subsubcat) => normalizeString(subsubcat).includes(normalizeString(selectedSubsubcategory))
        );
      } else if (selectedSubcategory) {
        const distributorSubcategories = parseCategories(distributor?.subcategory);
        matchesSubcategory = distributorSubcategories.some(
          (subcat) => normalizeString(subcat).includes(normalizeString(selectedSubcategory))
        );
      } else if (selectedCategory) {
        matchesCategory = productNames.some((name) => {
          const normalizedName = normalizeString(name);
          const normalizedSelectedCategory = normalizeString(selectedCategory);
          const match = normalizedName.includes(normalizedSelectedCategory) ||
                        normalizedSelectedCategory.includes(normalizedName);
          console.log(`Comparing category: ${normalizedName} vs ${normalizedSelectedCategory} -> ${match}`);
          return match;
        });
      }

      const matches = (
        (!selectedCountry || normalizeString(distributor?.country || "").includes(normalizeString(selectedCountry))) &&
        (!selectedProvince || normalizeString(distributor?.province || "").includes(normalizeString(selectedProvince))) &&
        (!selectedCanton || normalizeString(distributor?.canton || "").includes(normalizeString(selectedCanton))) &&
        (!selectedDistrict || normalizeString(distributor?.distrito || "").includes(normalizeString(selectedDistrict))) &&
        (selectedDirectory === "comercios"
          ? !(distributor.products || []).includes(19)
          : selectedDirectory === "cooperativas"
          ? (distributor.products || []).includes(19)
          : selectedDirectory === "asociaciones"
          ? (distributor.products || []).includes(25)
          : true) &&
        (!selectedComercialActivity ||
          normalizeString(distributor?.comercial_activity || "").includes(normalizeString(selectedComercialActivity))) &&
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
    );

    if (selectedSubsubcategory) {
      sorted = sorted.sort((a, b) => {
        const aSubsubcategories = parseCategories(a?.subsubcategory).sort(naturalSort);
        const bSubsubcategories = parseCategories(b?.subsubcategory).sort(naturalSort);
        const aFirstSubsubcat = aSubsubcategories[0] || "";
        const bFirstSubsubcat = bSubsubcategories[0] || "";
        return naturalSort(aFirstSubsubcat, bFirstSubsubcat);
      });
    } else if (selectedSubcategory) {
      sorted = sorted.sort((a, b) => {
        const aSubcategories = parseCategories(a?.subcategory).sort(naturalSort);
        const bSubcategories = parseCategories(b?.subcategory).sort(naturalSort);
        const aFirstSubcat = aSubcategories[0] || "";
        const bFirstSubcat = bSubcategories[0] || "";
        return naturalSort(aFirstSubcat, bFirstSubcat);
      });
    } else {
      sorted = sorted.sort((a, b) =>
        normalizeString(a?.name || "").localeCompare(normalizeString(b?.name || ""))
      );
    }

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

  const sanctifySearchTerm = (term) => {
    const element = document.createElement("div");
    element.innerHTML = term;
    return element.textContent || element.innerText || "";
  };

  const handleSearch = () => {
    const sanitizedSearchTerm = sanctifySearchTerm(searchTerm);
    if (!sanitizedSearchTerm) {
      const results = allDistributors.filter((distributor) => {
        const matchesService = selectedService
          ? distributor.services?.some(
              (service) =>
                service?.id === selectedService?.id ||
                normalizeString(service?.name) === normalizeString(selectedService?.name)
          )
        : true;
        let matchesCategory = true;
        let matchesSubcategory = true;
        let matchesSubsubcategory = true;

        if (selectedSubsubcategory) {
          const distributorSubsubcategories = parseCategories(distributor?.subsubcategory);
          matchesSubsubcategory = distributorSubsubcategories.some(
            (subsubcat) => normalizeString(subsubcat) === normalizeString(selectedSubsubcategory)
          );
        } else if (selectedSubcategory) {
          const distributorSubcategories = parseCategories(distributor?.subcategory);
          matchesSubcategory = distributorSubcategories.some(
            (subcat) => normalizeString(subcat) === normalizeString(selectedSubcategory)
          );
        } else if (selectedCategory) {
          matchesCategory = (distributor.productNames || []).some(
            (name) => normalizeString(name) === normalizeString(selectedCategory)
          );
        }

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
      const results = fuse.search(normalizeString(sanitizedSearchTerm)).map((result) => result.item);

      const filteredResults = results.filter((distributor) => {
        const matchesService = selectedService
          ? distributor.services?.some(
              (service) =>
                service?.id === selectedService?.id ||
                normalizeString(service?.name) === normalizeString(selectedService?.name)
            )
          : true;
        let matchesCategory = true;
        let matchesSubcategory = true;
        let matchesSubsubcategory = true;

        if (selectedSubsubcategory) {
          const distributorSubsubcategories = parseCategories(distributor?.subsubcategory);
          matchesSubsubcategory = distributorSubsubcategories.some(
            (subsubcat) => normalizeString(subsubcat) === normalizeString(selectedSubsubcategory)
          );
        } else if (selectedSubcategory) {
          const distributorSubcategories = parseCategories(distributor?.subcategory);
          matchesSubcategory = distributorSubcategories.some(
            (subcat) => normalizeString(subcat) === normalizeString(selectedSubcategory)
          );
        } else if (selectedCategory) {
          matchesCategory = (distributor.productNames || []).some(
            (name) => normalizeString(name) === normalizeString(selectedCategory)
          );
        }

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

      {!isFullyLoaded && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <LoadingSpinner />
        </div>
      )}

      {updatedSubProducts.length === 0 && isFullyLoaded ? (
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