import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDataService from '../../../services/products';
import "./catalogo.css";

const ITEMS_PER_PAGE = 8;

const Catalogo = () => {
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null); // Para el modal

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, typesRes, charsRes] = await Promise.all([
          ProductDataService.getAllProducts(token),
          ProductDataService.getAllProductTypes(token),
          ProductDataService.getAllCharacteristics(token)
        ]);

        setProducts(productsRes.data.results || productsRes.data);
        setProductTypes(typesRes.data.results || typesRes.data);
        setCharacteristics(charsRes.data.results || charsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleCharacteristicChange = (e) => {
    const value = parseInt(e.target.value);
    setSelectedCharacteristics(prev =>
      e.target.checked
        ? [...prev, value]
        : prev.filter(id => id !== value)
    );
    setCurrentPage(1);
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const typeMatch = !selectedType || product.product_type.id === parseInt(selectedType);
    const charsMatch = selectedCharacteristics.every(selectedId =>
      product.characteristics.some(char => char.id === selectedId)
    );
    return typeMatch && charsMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Abrir modal
  const openModal = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden'; // Bloquear scroll
  };

  // Cerrar modal
  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
    <>
      <motion.div className="catalogo-page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Título */}
        <header className="catalogo-page-header">
          <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
            <span className="glitch" data-text="CATÁLOGO">CATÁLOGO</span> DE PRODUCTOS
          </motion.h1>
        </header>

        <div className="catalogo-layout">
          {/* Sidebar de filtros */}
          <aside className="filters-sidebar">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="filter-group">
                <h5>Filtrar por Tipo de Producto</h5>
                <select className="form-select" value={selectedType} onChange={handleTypeChange}>
                  <option value="">Todos los tipos</option>
                  {productTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h5>Filtrar por Características</h5>
                <div className="characteristics-list">
                  {characteristics.map(char => (
                    <label key={char.id} className="form-check">
                      <input
                        type="checkbox"
                        value={char.id}
                        checked={selectedCharacteristics.includes(char.id)}
                        onChange={handleCharacteristicChange}
                        className="form-check-input"
                      />
                      <span className="form-check-label">{char.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Productos */}
          <main className="products-main">
            <div className="results-count">
              Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="products-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      className="product-card glass"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => openModal(product)}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.design_file ? (
                        <img src={product.design_file} className="card-img-top" alt={product.name} />
                      ) : (
                        <div className="card-img-placeholder">Sin imagen</div>
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
                  <div className="no-results">
                    <p>No se encontraron productos con los filtros seleccionados.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Anterior
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Siguiente
                </button>
              </div>
            )}
          </main>
        </div>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="product-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="product-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={closeModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="modal-product-grid">
                {/* Imagen */}
                <div className="modal-image-container">
                  {selectedProduct.design_file ? (
                    <img src={selectedProduct.design_file} alt={selectedProduct.name} className="modal-product-image" />
                  ) : (
                    <div className="modal-image-placeholder">Sin imagen disponible</div>
                  )}
                </div>

                {/* Detalles */}
                <div className="modal-product-details">
                  <h2 className="modal-product-title">{selectedProduct.name}</h2>
                  <p className="modal-product-description">{selectedProduct.description}</p>

                  <div className="modal-price">
                    <span className="price-label">Precio Total:</span>
                    <span className="price-value">
                      ${(parseFloat(selectedProduct.product_type.base_price) + parseFloat(selectedProduct.additional_price)).toFixed(2)}
                    </span>
                  </div>

                  <div className="modal-section">
                    <h4>Tipo de Producto</h4>
                    <p>{selectedProduct.product_type.name}</p>
                  </div>

                  <div className="modal-section">
                    <h4>Características</h4>
                    <ul className="modal-characteristics">
                      {selectedProduct.characteristics.map(char => (
                        <li key={char.id}>
                          <strong>{char.name}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-actions">
  <button 
    className="btn-add-to-cart"
    onClick={() => {
      const product = selectedProduct;
      const basePrice = parseFloat(product.product_type.base_price);
      const additionalPrice = parseFloat(product.additional_price);
      const totalPrice = (basePrice + additionalPrice).toFixed(2);
      
      const characteristicsList = product.characteristics
        .map(char => `• ${char.name}`)
        .join('%0A');

      const message = encodeURIComponent(
`¡Hola! Me interesa el siguiente producto del catálogo:

*${product.name}*
${product.description}

*Precio Total:* ₡${totalPrice}
*Tipo:* ${product.product_type.name}

*Características:*
${characteristicsList}

¡Quiero más información o cotizarlo!`
      );

      const whatsappUrl = `https://wa.me/50683856602?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }}
  >

    Contáctanos por WhatsApp
  </button>
</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Catalogo;