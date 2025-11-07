import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations, similar to previous component
import ProductDataService from '../../../services/products';
import "./catalogo.css"

const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener token si existe, pero no lo requerimos obligatoriamente
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todos los productos (sin requerir token obligatoriamente)
        const productsResponse = await ProductDataService.getAllProducts(token);
        setProducts(productsResponse.data.results || productsResponse.data); // Manejar paginación si aplica

        // Obtener todos los tipos de productos
        const typesResponse = await ProductDataService.getAllProductTypes(token);
        setProductTypes(typesResponse.data.results || typesResponse.data);

        // Obtener todas las características
        const charsResponse = await ProductDataService.getAllCharacteristics(token);
        setCharacteristics(charsResponse.data.results || charsResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    // Siempre intentamos cargar, incluso sin token (el backend lo permite ahora)
    fetchData();
  }, []);  // Eliminamos [token] como dependencia, para que cargue siempre

  // Manejar selección de tipo de producto
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  // Manejar selección de características (multi-select con checkboxes)
  const handleCharacteristicChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedCharacteristics([...selectedCharacteristics, value]);
    } else {
      setSelectedCharacteristics(selectedCharacteristics.filter(id => id !== value));
    }
  };

  // Filtrar productos basados en selecciones
  const filteredProducts = products.filter(product => {
    const typeMatch = !selectedType || product.product_type.id === parseInt(selectedType);
    const charsMatch = selectedCharacteristics.every(selectedId =>
      product.characteristics.some(char => char.id === selectedId)
    );
    return typeMatch && charsMatch;
  });

  if (loading) {
    return (
      <motion.div className="loading-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="pulse-loader">
          <div></div><div></div><div></div><div></div>
        </div>
        <p>CARGANDO CATÁLOGO...</p>
      </motion.div>
    );
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <motion.div className="catalogo-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="catalogo-header">
        <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }}>
          <span className="glitch" data-text="CATÁLOGO">CATÁLOGO</span> DE PRODUCTOS
        </motion.h1>
      </header>

      {/* Sección de filtros */}
      <motion.div className="filters-bar" initial={{ y: 30 }} animate={{ y: 0 }}>
        <div className="filter-section">
          <h5>Filtrar por Tipo de Producto</h5>
          <select 
            className="form-select" 
            value={selectedType} 
            onChange={handleTypeChange}
          >
            <option value="">Todos los tipos</option>
            {productTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-section">
          <h5>Filtrar por Características</h5>
          {characteristics.map(char => (
            <div key={char.id} className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                value={char.id} 
                id={`char-${char.id}`} 
                onChange={handleCharacteristicChange}
                checked={selectedCharacteristics.includes(char.id)}
              />
              <label className="form-check-label" htmlFor={`char-${char.id}`}>
                {char.name}
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid de cards de productos */}
      <AnimatePresence>
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className="product-card glass"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                exit={{ opacity: 0 }}
              >
                {product.design_file && (
                  <img 
                    src={product.design_file} 
                    className="card-img-top" 
                    alt={product.name} 
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <strong>Tipo:</strong> {product.product_type.name}<br />
                    <strong>Precio Total:</strong> ${(parseFloat(product.product_type.base_price) + parseFloat(product.additional_price)).toFixed(2)}
                  </p>
                  <p className="card-text">
                    <strong>Características:</strong>
                    <ul>
                      {product.characteristics.map(char => (
                        <li key={char.id}>{char.name}</li>
                      ))}
                    </ul>
                  </p>
                </div>
                <div className="glow-effect"></div>
              </motion.div>
            ))
          ) : (
            <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p>No se encontraron productos con los filtros seleccionados.</p>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </motion.div>
  );
};

export default Catalogo;