import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import Fuse from "fuse.js";
import "./Megabuscador.css";
import { useMediaQuery } from "react-responsive";
import faqData from "./faqData.json"; // Importa el archivo faqData.json

const Megabuscador = ({ products, clasificados, subproducts, services }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 2;
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  // Normalize string function
  const normalizeString = (str) => {
    if (!str || typeof str !== "string") return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  // Check if data is loaded and log services and subproducts
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
      console.log("Services data:", services);
      console.log("Subproducts data:", subproducts);
      console.log("FAQ data:", faqData);
    } else {
      setDataLoaded(false);
    }
  }, [products, clasificados, subproducts, services]);

  // Fuse.js configurations
  const serviceFuse = new Fuse(services, {
    keys: [
      "name",
      "description",
      "category",
      "subcategory",
      "subsubcategory",
    ],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  const classifiedFuse = new Fuse(clasificados, {
    keys: [
      "title",
      "category",
      "subcategory",
      "subsubcategory",
      "description",
      "url",
    ],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  const subproductFuse = new Fuse(subproducts, {
    keys: [
      "name",
      "address",
      "comercial_activity",
      "contact_name",
      "email",
      "province",
      "canton",
      "distrito",
      "url",
    ],
    threshold: 0.4,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  const productFuse = new Fuse(products, {
    keys: ["name", "description", "category", "url"],
    threshold: 0.3,
    includeScore: true,
    getFn: (obj, path) => normalizeString(Fuse.config.getFn(obj, path)),
  });

  // Fuse.js para FAQs con umbral más estricto
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
    }
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value && dataLoaded) {
      setIsLoading(true);
      const normalizedQuery = normalizeString(value);

      // Obtener resultados de FAQs primero
      const faqResults = faqFuse.search(normalizedQuery).map((result) => ({
        ...result.item,
        type: "faq",
        url: "/faq",
        score: result.score,
      }));

      // Obtener resultados de subproductos
      const subproductResults = subproductFuse.search(normalizedQuery).map((result) => ({
        ...result.item,
        type: "subproduct",
        score: result.score,
      }));

      // Obtener otros resultados
      const serviceResults = serviceFuse.search(normalizedQuery).map((result) => ({
        ...result.item,
        type: "service",
        score: result.score,
      }));
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

      // Combinar resultados con prioridad: FAQs > Subproductos > Servicios > Productos > Clasificados
      const combinedResults = [
        ...faqResults,
        ...subproductResults,
        ...serviceResults,
        ...productResults,
        ...classifiedResults,
      ];

      // Ordenar por puntaje para mantener relevancia
      const sortedResults = combinedResults.sort((a, b) => a.score - b.score);

      // Limitar sugerencias a 5
      setSuggestions(sortedResults.slice(0, 5));
      setIsLoading(false);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name || suggestion.title || suggestion.question || "");
    if (suggestion.type === "service") {
      const relatedSubproduct = subproducts.find(
        (subproduct) => subproduct.id === suggestion.subproduct
      );
      setResults([{ ...suggestion, relatedSubproduct: relatedSubproduct || null }]);
    } else {
      setResults([suggestion]);
    }
    setSuggestions([]);
    setCurrentPage(1);
    setIsLoading(false);
  };

  const handleSearch = () => {
    if (query && dataLoaded) {
      setIsLoading(true);
      const normalizedQuery = normalizeString(query);

      // Obtener resultados de FAQs primero
      const faqResults = faqFuse.search(normalizedQuery).map((result) => ({
        ...result.item,
        type: "faq",
        url: "/faq",
        score: result.score,
      }));

      // Obtener resultados de subproductos
      const subproductResults = subproductFuse.search(normalizedQuery).map((result) => ({
        ...result.item,
        type: "subproduct",
        score: result.score,
      }));

      // Obtener resultados de servicios con subproductos relacionados
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

      // Obtener otros resultados
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

      // Combinar resultados con prioridad: FAQs > Subproductos > Servicios > Productos > Clasificados
      const combinedResults = [
        ...faqResults,
        ...subproductResults,
        ...serviceResults,
        ...productResults,
        ...classifiedResults,
      ];

      // Ordenar por puntaje para mantener relevancia
      const sortedResults = combinedResults.sort((a, b) => a.score - b.score);

      setResults(sortedResults);
      setSuggestions([]);
      setCurrentPage(1);
      setIsLoading(false);
    } else if (query && !dataLoaded) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
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

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setQuery(speechToText);
      if (dataLoaded) {
        setIsLoading(true);
        const normalizedQuery = normalizeString(speechToText);

        // Obtener resultados de FAQs primero
        const faqResults = faqFuse.search(normalizedQuery).map((result) => ({
          ...result.item,
          type: "faq",
          url: "/faq",
          score: result.score,
        }));

        // Obtener resultados de subproductos
        const subproductResults = subproductFuse.search(normalizedQuery).map((result) => ({
          ...result.item,
          type: "subproduct",
          score: result.score,
        }));

        // Obtener resultados de servicios con subproductos relacionados
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

        // Obtener otros resultados
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

        // Combinar resultados con prioridad: FAQs > Subproductos > Servicios > Productos > Clasificados
        const combinedResults = [
          ...faqResults,
          ...subproductResults,
          ...serviceResults,
          ...productResults,
          ...classifiedResults,
        ];

        // Ordenar por puntaje para mantener relevancia
        const sortedResults = combinedResults.sort((a, b) => a.score - b.score);

        setResults(sortedResults);
        setSuggestions([]);
        setCurrentPage(1);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      setIsLoading(false);
    };

    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  const handleCategoryClick = () => {
    setQuery("Clasificados");
    if (dataLoaded) {
      setIsLoading(true);
      const classifiedResults = classifiedFuse
        .search("Clasificados")
        .map((result) => ({
          ...result.item,
          type: "classified",
        }));
      const subproductResults = subproductFuse
        .search("Clasificados")
        .map((result) => ({
          ...result.item,
          type: "subproduct",
        }));
      const productResults = productFuse.search("Clasificados").map((result) => ({
        ...result.item,
        type: "product",
      }));
      const faqResults = faqFuse.search("Clasificados").map((result) => ({
        ...result.item,
        type: "faq",
        url: "/faq",
      }));
      setResults([
        ...faqResults,
        ...subproductResults,
        ...productResults,
        ...classifiedResults,
      ]);
      setSuggestions([]);
      setCurrentPage(1);
      setIsLoading(false);
    } else {
      setIsLoading(true);
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
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <span className="mic-icon" onClick={handleMicClick}>
            <FaMicrophone />
          </span>
        </div>
        <div className="buttons">
          <button className="search-button" onClick={handleSearch}>
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
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion.name ||
              suggestion.title ||
              suggestion.question ||
              "Sin título"}
          </p>
        ))}
      </div>
      <div className="search-results">
        {paginatedResults.map((result, index) => (
          <div key={index} className="result-item">
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
              {result.name ||
                result.title ||
                result.question ||
                "Título no disponible"}
            </a>
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
              {result.comercial_activity &&
                `Actividad: ${result.comercial_activity}`}
              {result.province && ` | Provincia: ${result.province}`}
              {result.canton && ` | Cantón: ${result.canton}`}
              {result.category && ` | Categoría: ${result.category}`}
              {result.price &&
                ` | Precio: ₡${parseFloat(result.price).toLocaleString()}`}
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
        {results.length === 0 &&
          !suggestions.length &&
          query &&
          !isLoading &&
          !error && (
            <p className="no-results">
              No se encontraron resultados para "{query}".
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