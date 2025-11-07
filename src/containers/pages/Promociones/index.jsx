import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductDataService from '../../../services/products';
import "./Promociones.css";

const ITEMS_PER_PAGE = 8;

const Promociones = () => {
  const [promotions, setPromotions] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [minDiscount, setMinDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promoRes, typesRes] = await Promise.all([
          ProductDataService.getAllPromotions(token),
          ProductDataService.getAllProductTypes(token)
        ]);

        setPromotions(promoRes.data.results || promoRes.data);
        setProductTypes(typesRes.data.results || typesRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las promociones.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar promociones
  const filteredPromotions = promotions.filter(promo => {
    const typeMatch = !selectedType || promo.products.some(p => 
      p.product_type && p.product_type.id === parseInt(selectedType)
    );
    const discountMatch = promo.discount >= minDiscount;
    return typeMatch && discountMatch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredPromotions.length / ITEMS_PER_PAGE);
  const paginatedPromotions = filteredPromotions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal
  const openModal = (promo) => {
    setSelectedPromotion(promo);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPromotion(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleMinDiscountChange = (e) => {
    setMinDiscount(parseInt(e.target.value) || 0);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <motion.div className="loading-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="pulse-loader">
          <div></div><div></div><div></div><div></div>
        </div>
        <p>CARGANDO PROMOCIONES...</p>
      </motion.div>
    );
  }

  if (error) {
    return <div className="error-screen">{error}</div>;
  }

  return (
    <>
      <motion.div className="promociones-page-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Título */}
        <header className="promociones-page-header">
          <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
            <span className="glitch" data-text="PROMOCIONES">PROMOCIONES</span> EXCLUSIVAS
          </motion.h1>
        </header>

        <div className="promociones-layout">
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
                <h5>Descuento Mínimo (%)</h5>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minDiscount}
                  onChange={handleMinDiscountChange}
                  className="discount-slider"
                />
                <div className="discount-value">{minDiscount}%</div>
              </div>
            </motion.div>
          </aside>

          {/* Productos */}
          <main className="promotions-main">
            <div className="results-count">
              Mostrando {paginatedPromotions.length} de {filteredPromotions.length} promociones
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="promotions-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {paginatedPromotions.length > 0 ? (
                  paginatedPromotions.map((promo, i) => (
                    <motion.div
                      key={promo.id}
                      className="promotion-card glass"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => openModal(promo)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="promotion-image-container">
                        {promo.products[0]?.design_file ? (
                          <img src={promo.products[0].design_file} alt={promo.name} className="promotion-image" />
                        ) : (
                          <div className="image-placeholder">Sin imagen</div>
                        )}
                        <div className="discount-badge">-{promo.discount}%</div>
                      </div>
                      <div className="promotion-body">
                        <h5 className="promotion-title">{promo.name}</h5>
                        <p className="promotion-description">{promo.description}</p>
                        <p className="promotion-min">Mínimo de compra: {promo.min_amount}</p>
                        <div className="included-products">
                          <strong>Productos:</strong>
                          <ul>
                            {promo.products.map(p => (
                              <li key={p.id}>{p.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="glow-effect"></div>
                    </motion.div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No se encontraron promociones con los filtros seleccionados.</p>
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

      {/* MODAL DE PROMOCIÓN */}
      <AnimatePresence>
        {selectedPromotion && (
          <motion.div
            className="promotion-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="promotion-modal-content"
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

              <div className="modal-promo-grid">
                <div className="modal-image-container">
                  {selectedPromotion.products[0]?.design_file ? (
                    <img src={selectedPromotion.products[0].design_file} alt={selectedPromotion.name} className="modal-promo-image" />
                  ) : (
                    <div className="modal-image-placeholder">Sin imagen</div>
                  )}
                </div>

                <div className="modal-promo-details">
                  <h2 className="modal-promo-title">{selectedPromotion.name}</h2>
                  <div className="modal-discount-badge">-{selectedPromotion.discount}% DESCUENTO</div>
                  <p className="modal-promo-description">{selectedPromotion.description}</p>

                  <div className="modal-section">
                    <h4>Mínimo de compra</h4>
                    <p className="modal-min-amount">{selectedPromotion.min_amount}</p>
                  </div>

                  <div className="modal-section">
                    <h4>Productos Incluidos</h4>
                    <ul className="modal-products-list">
                      {selectedPromotion.products.map(p => (
                        <li key={p.id}>
                          <strong>{p.name}</strong> - ₡{p.price}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-actions">
  <button 
    className="btn-contact"
    onClick={() => {
      const promo = selectedPromotion;
      const productsList = promo.products
        .map(p => `• ${p.name} - $${p.price}`)
        .join('%0A');
      
      const message = encodeURIComponent(
`¡Hola! Me interesa la promoción:

*${promo.name}*
Descuento: *${promo.discount}% OFF*
Monto mínimo: *₡${promo.min_amount}*

*Productos incluidos:*
${productsList}

¡Quiero aprovechar esta oferta!`
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

export default Promociones;