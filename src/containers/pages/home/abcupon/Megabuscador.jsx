import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaMicrophone, FaSearch, FaStar } from "react-icons/fa";
import Fuse from "fuse.js";
import "./Megabuscador.css";
import { useMediaQuery } from "react-responsive";
import faqData from "./faqData.json";
import ProductDataService from "../../../../services/products";

const Megabuscador = ({ products, clasificados, subproducts, services }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const resultsPerPage = 2;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const token = useSelector((state) => state.authentication.token);

  // Normalize string function
  const normalizeString = (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Check if data is loaded
  useEffect(() => {
    if (
      Array.isArray(products) &&
      Array.isArray(clasificados) &&
      Array.isArray(subproducts) &&
      Array.isArray(services) &&
      (products.length > 0 ||
        clasificados.length > 0 ||
        subproducts.length > 0 ||
        services.length > 0 ||
        faqData.length > 0)
    ) {
      setDataLoaded(true);
      setError(null);
    } else {
      setDataLoaded(false);
    }
  }, [products, clasificados, subproducts, services]);

  // Fuse.js configurations
  const serviceFuse = new Fuse(services, {
    keys: ["name", "description", "category", "subcategory", "subsubcategory"],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  const classifiedFuse = new Fuse(clasificados, {
    keys: ["title", "category", "subcategory", "subsubcategory", "description", "url"],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  const productFuse = new Fuse(products, {
    keys: ["name", "description", "category", "url"],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  const faqFuse = new Fuse(faqData, {
    keys: ["question", "answer"],
    threshold: 0.2,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSuggestions([]);
      setIsLoading(false);
      setSearchTriggered(false);
    }
  }, [query]);

  const handleSearch = async () => {
    if (query && dataLoaded) {
      setIsLoading(true);
      setError(null);
      setSearchTriggered(true);
      const normalizedQuery = normalizeString(query);

      try {
        // Search subproducts via backend API
        let subproductResults = [];
        if (normalizedQuery) {
          const response = await ProductDataService.searchSubProduct(token, normalizedQuery, 1, 1000);
          subproductResults = (response.data.results || response.data).map(item => ({
            ...item,
            type: "subproduct",
            score: 0,
          }));
        } else {
          subproductResults = subproducts.map(item => ({
            ...item,
            type: "subproduct",
            score: 0,
          }));
        }

        // Search other data types with Fuse.js
        const faqResults = faqFuse.search(normalizedQuery).map((result) => ({
          ...result.item,
          type: "faq",
          url: "/faq",
          score: result.score,
        }));

        const serviceResults = serviceFuse.search(normalizedQuery).map((result) => {
          const relatedSubproduct = subproducts.find(
            (subproduct) => subproduct.id === result.item.subproduct
          );
          return {
            ...result.item,
            type: "service",
            relatedSubproduct: relatedSubproduct || null,
            score: result.score,
          };
        });

        const classifiedResults = classifiedFuse.search(normalizedQuery).map((result) => ({
          ...result.item,
          type: "classified",
          score: result.score,
        }));

        const productResults = productFuse.search(normalizedQuery).map((result) => ({
          ...result.item,
          type: "product",
          score: result.score,
        }));

        // Combine results with priority: FAQs > Subproducts > Services > Products > Classifieds
        const combinedResults = [
          ...faqResults,
          ...subproductResults,
          ...serviceResults,
          ...productResults,
          ...classifiedResults,
        ];

        // Sort by score (Fuse.js results), type, and point_of_sale
        const sortedResults = combinedResults.sort((a, b) => {
          if (a.type === "subproduct" && b.type === "subproduct") {
            if (a.point_of_sale && !b.point_of_sale) return -1;
            if (!a.point_of_sale && b.point_of_sale) return 1;
          }
          if (a.type === "subproduct" && b.type !== "subproduct") return -1;
          if (a.type !== "subproduct" && b.type === "subproduct") return 1;
          return a.score - b.score;
        });

        setResults(sortedResults);
        setSuggestions([]);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error searching subproducts:", err);
        setError("Error al buscar subproductos. Intente de nuevo.");
        setResults([]);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else if (query && !dataLoaded) {
      setError("Datos no cargados. Espere un momento.");
      setIsLoading(false);
      setSearchTriggered(true);
    } else {
      setResults(subproducts.map(item => ({ ...item, type: "subproduct", score: 0 })));
      setSuggestions([]);
      setCurrentPage(1);
      setIsLoading(false);
      setSearchTriggered(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleMicClick = async () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert("Tu navegador no soporta el reconocimiento de voz.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "es-ES";

    recognition.onstart = () => {
      setIsSpeaking(true);
    };

    recognition.onend = () => {
      setIsSpeaking(false);
    };

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuery(speechToText);
      if (dataLoaded) {
        setIsLoading(true);
        setSearchTriggered(true);
        const normalizedQuery = normalizeString(speechToText);

        try {
          // Search subproducts via backend API
          let subproductResults = [];
          if (normalizedQuery) {
            const response = await ProductDataService.searchSubProduct(token, normalizedQuery, 1, 1000);
            subproductResults = (response.data.results || response.data).map(item => ({
              ...item,
              type: "subproduct",
              score: 0,
            }));
          } else {
            subproductResults = subproducts.map(item => ({
              ...item,
              type: "subproduct",
              score: 0,
            }));
          }

          // Search other data types with Fuse.js
          const faqResults = faqFuse.search(normalizedQuery).map((result) => ({
            ...result.item,
            type: "faq",
            url: "/faq",
            score: result.score,
          }));

          const serviceResults = serviceFuse.search(normalizedQuery).map((result) => {
            const relatedSubproduct = subproducts.find(
              (subproduct) => subproduct.id === result.item.subproduct
            );
            return {
              ...result.item,
              type: "service",
              relatedSubproduct: relatedSubproduct || null,
              score: result.score,
            };
          });

          const classifiedResults = classifiedFuse.search(normalizedQuery).map((result) => ({
            ...result.item,
            type: "classified",
            score: result.score,
          }));

          const productResults = productFuse.search(normalizedQuery).map((result) => ({
            ...result.item,
            type: "product",
            score: result.score,
          }));

          // Combine and sort results
          const combinedResults = [
            ...faqResults,
            ...subproductResults,
            ...serviceResults,
            ...productResults,
            ...classifiedResults,
          ];

          const sortedResults = combinedResults.sort((a, b) => {
            if (a.type === "subproduct" && b.type === "subproduct") {
              if (a.point_of_sale && !b.point_of_sale) return -1;
              if (!a.point_of_sale && b.point_of_sale) return 1;
            }
            if (a.type === "subproduct" && b.type !== "subproduct") return -1;
            if (a.type !== "subproduct" && b.type === "subproduct") return 1;
            return a.score - b.score;
          });

          setResults(sortedResults);
          setSuggestions([]);
          setCurrentPage(1);
        } catch (err) {
          console.error("Error searching subproducts:", err);
          setError("Error al buscar subproductos. Intente de nuevo.");
          setResults([]);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      setIsLoading(false);
    };

    recognition.start();
  };

  const paginateResults = (results) => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return results.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(results.length / resultsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedResults = paginateResults(results);

  const handleCategoryClick = async () => {
    setQuery("Clasificados");
    if (dataLoaded) {
      setIsLoading(true);
      setSearchTriggered(true);
      try {
        // Use initial subproducts for "Clasificados" search
        const subproductResults = subproducts.map(item => ({
          ...item,
          type: "subproduct",
          score: 0,
        }));

        const classifiedResults = classifiedFuse.search("Clasificados").map((result) => ({
          ...result.item,
          type: "classified",
          score: result.score,
        }));

        const productResults = productFuse.search("Clasificados").map((result) => ({
          ...result.item,
          type: "product",
          score: result.score,
        }));

        const faqResults = faqFuse.search("Clasificados").map((result) => ({
          ...result.item,
          type: "faq",
          url: "/faq",
          score: result.score,
        }));

        const combinedResults = [
          ...faqResults,
          ...subproductResults,
          ...productResults,
          ...classifiedResults,
        ];

        // Sort with point_of_sale priority
        const sortedResults = combinedResults.sort((a, b) => {
          if (a.type === "subproduct" && b.type === "subproduct") {
            if (a.point_of_sale && !b.point_of_sale) return -1;
            if (!a.point_of_sale && b.point_of_sale) return 1;
          }
          if (a.type === "subproduct" && b.type !== "subproduct") return -1;
          if (a.type !== "subproduct" && b.type === "subproduct") return 1;
          return a.score - b.score;
        });

        setResults(sortedResults);
        setSuggestions([]);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error processing category click:", err);
        setError("Error al procesar la búsqueda de clasificados.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="megabuscador-container">
      <div className="search-area">
        <h1 className="search-title">
          <span className="red-text">ABCUPON</span>
        </h1>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar en ABCupon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          {isLoading ? (
            <span className="search-icon loading">
              <div className="spinner"></div>
            </span>
          ) : (
            <span className="search-icon" onClick={handleSearch}>
              <FaSearch />
            </span>
          )}
          <span className={`mic-icon ${isSpeaking ? "speaking" : ""}`} onClick={handleMicClick}>
            <FaMicrophone />
          </span>
        </div>
        <div className="buttons">
          <button className="search-button" onClick={handleSearch} disabled={isLoading}>
            Buscar
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="loading">
          <p>Cargando datos...</p>
          <div className="spinner"></div>
        </div>
      )}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <p
            key={index}
            className="suggestion-item"
            onClick={() => {
              setQuery(suggestion.name || suggestion.title || suggestion.question || "");
              handleSearch();
            }}
          >
            {suggestion.name || suggestion.title || suggestion.question || "Sin título"}
          </p>
        ))}
      </div>
      <div className="search-results">
        {paginatedResults.map((result, index) => (
          <div key={index} className="result-item">
            <div className="result-title-container">
              <a
                href={
                  result.type === "faq"
                    ? "/faq"
                    : result.type === "service" && result.relatedSubproduct?.email
                    ? `https://abcupon.com/servicios/${result.relatedSubproduct.email}`
                    : result.url ||
                      result.link ||
                      (result.email
                        ? `https://abcupon.com/servicios/${result.email}`
                        : "https://abcupon.com/avisos_economicos")
                }
                target={result.type === "faq" ? "_self" : "_blank"}
                rel={result.type === "faq" ? "" : "noopener noreferrer"}
                className="result-title"
              >
                {result.name || result.title || result.question || "Título no disponible"}
              </a>
              {result.type === "subproduct" && result.point_of_sale && (
                <span className="point-of-sale-star-container">
                  <FaStar className="point-of-sale-star" />
                  <span className="point-of-sale-tooltip">Punto de venta ABCupon</span>
                </span>
              )}
            </div>
            <p className="result-description">
              {result.type === "faq"
                ? Array.isArray(result.answer)
                  ? result.answer.join(" ")
                  : result.answer
                : result.description
                ? result.description.length > 200
                  ? `${result.description.slice(0, 200)}...`
                  : result.description
                : result.address ||
                  "¿Deseas rellenar con la información de su negocio? Contacténos al 8687-6767"}
            </p>
            <p className="result-details">
              {result.comercial_activity && `Actividad: ${result.comercial_activity}`}
              {result.province && ` | Provincia: ${result.province}`}
              {result.canton && ` | Cantón: ${result.canton}`}
              {result.category && ` | Categoría: ${result.category}`}
              {result.price && ` | Precio: ₡${parseFloat(result.price).toLocaleString()}`}
              {result.type === "faq" && " | Pregunta Frecuente"}
            </p>
            {result.type === "service" && result.relatedSubproduct && (
              <div className="related-subproducts">
                <ul>
                  <li>
                    <a
                      href={`https://abcupon.com/servicios/${result.relatedSubproduct.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.relatedSubproduct.name || "Subproducto sin nombre"}
                    </a>
                    {result.relatedSubproduct.point_of_sale && (
                      <span className="point-of-sale-star-container">
                        <FaStar className="point-of-sale-star" />
                        <span className="point-of-sale-tooltip">Punto de venta</span>
                      </span>
                    )}
                  </li>
                </ul>
              </div>
            )}
            <a
              href={
                result.type === "faq"
                  ? "/faq"
                  : result.type === "service" && result.relatedSubproduct?.email
                  ? `https://abcupon.com/servicios/${result.relatedSubproduct.email}`
                  : result.url ||
                    result.link ||
                    (result.email
                      ? `https://abcupon.com/servicios/${result.email}`
                      : "https://abcupon.com/avisos_economicos")
              }
              target={result.type === "faq" ? "_self" : "_blank"}
              rel={result.type === "faq" ? "" : "noopener noreferrer"}
              className="result-link"
            >
              {result.type === "faq"
                ? "/faq"
                : result.type === "service" && result.relatedSubproduct?.email
                ? `https://abcupon.com/servicios/${result.relatedSubproduct.email}`
                : result.url ||
                  result.link ||
                  (result.email
                    ? `https://abcupon.com/servicios/${result.email}`
                    : "https://abcupon.com/avisos_economicos")}
            </a>
          </div>
        ))}
        {query && !isLoading && !error && !searchTriggered && (
          <p className="no-results">
            Presione Enter o haga clic en el buscador para buscar en nuestro directorio.
          </p>
        )}
        {results.length === 0 && query && !isLoading && !error && searchTriggered && (
          <p className="no-results">
            En caso de no aparecer la empresa deseada, por favor contactar al 2220-2290.
          </p>
        )}
      </div>
      {results.length > resultsPerPage && (
        <div className="pagination">
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === Math.ceil(results.length / resultsPerPage)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Megabuscador;