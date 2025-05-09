import React, { useState, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa'; // Importación del icono de micrófono
import Fuse from 'fuse.js'; // Importación de Fuse.js
import './Megabuscador.css';

const mockData = [
  {
    title: "ABCupon - Directorio de Comercios",
    link: "https://www.abcupon.com",
    description: "Encuentra los mejores comercios en Costa Rica. Directorio digital con ofertas y más."
  },
  {
    title: "Noticias Cantonales en ABCupon",
    link: "https://www.abcupon.com/noticias",
    description: "Próximamente: Noticias locales, eventos y novedades de cada cantón."
  },
  {
    title: "Clasificados ABCupon",
    link: "https://www.abcupon.com/clasificados",
    description: "Clasificados de abcupon para promocionar sus promociones."
  }
];

const Megabuscador = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [recom, setRecom] = useState('Clasificados');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 2; // Máximo de dos resultados por página

  // Configuración de Fuse.js
  const fuse = new Fuse(mockData, {
    keys: ['title', 'description'], // Campos a buscar
    threshold: 0.3, // Nivel de tolerancia al error
    includeScore: true // Incluir el puntaje de la coincidencia
  });

  useEffect(() => {
    if (!query) {
      setResults([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      // Filtramos sugerencias utilizando Fuse.js
      const filteredSuggestions = fuse.search(value).map(result => result.item);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setResults([suggestion]);
    setSuggestions([]);
  };

  const handleSearch = () => {
    if (query) {
      // Realizamos la búsqueda con Fuse.js
      const searchResults = fuse.search(query).map(result => result.item);
      setResults(searchResults);
      setSuggestions([]);
      setCurrentPage(1); // Restablecer la página cuando se realiza una nueva búsqueda
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
      setTimeout(() => {
        const searchResults = fuse.search(speechToText).map(result => result.item);
        setResults(searchResults);
        setSuggestions([]);
        setCurrentPage(1); // Restablecer la página
      }, 1000); // Esperar 1 segundo
    };

    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
    };

    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Función para manejar la paginación
  const paginateResults = (results) => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return results.slice(startIndex, endIndex);
  };

  // Función para cambiar de página
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
    setQuery('Clasificados'); // Establece "Clasificados" en el input
    const searchResults = fuse.search('Clasificados').map(result => result.item);
    setResults(searchResults); // Realiza la búsqueda automáticamente
    setSuggestions([]);
    setCurrentPage(1); // Restablecer la página
  };

  return (
    <div className="megabuscador-container">
      <div className="search-area">
        <h1 className="search-title">
          <span className="red-text">A</span>
          <span className="red-text">B</span>
          <span className="red-text">C</span>
          <span className="red-text">upon</span>
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
          <p className="category-switch" onClick={handleCategoryClick}>
            {recom}
          </p>
        </div>
      </div>
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <p
            key={index}
            className="suggestion-item"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion.title}
          </p>
        ))}
      </div>
      <div className="search-results">
        {paginatedResults.map((result, index) => (
          <div key={index} className="result-item">
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-title">
              {result.title}
            </a>
            <p className="result-description">{result.description}</p>
            <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-link">
              {result.link}
            </a>
          </div>
        ))}
        {results.length === 0 && !suggestions.length && query && (
          <p className="no-results">No se encontraron resultados para "{query}".</p>
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
