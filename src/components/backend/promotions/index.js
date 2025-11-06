import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Plus, Edit, Trash2, Image, DollarSign, Tag } from 'lucide-react';
import ProductDataService from '../../../services/products';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './promotions.css';

const PromocionesAdmin = () => {
  const [promotions, setPromotions] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_amount: '',
    discount: '',
    products: [],
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Animaciones
  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Inicia sesión para gestionar promociones.');
        return;
      }
      setIsLoading(true);
      try {
        const [promoRes, prodRes] = await Promise.all([
          ProductDataService.getAllPromotions(token),
          ProductDataService.getAllProducts(token),
        ]);

        const promoData = Array.isArray(promoRes.data) ? promoRes.data : promoRes.data.results || [];
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.results || [];
        console.log("promoData", promoData);
        console.log("prodData", prodData);

        setPromotions(promoData);
        setProducts(prodData);
      } catch (err) {
        setError('Error al cargar datos: ' + (err.response?.data?.detail || err.message));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => parseInt(opt.value));
    setFormData({ ...formData, products: selected });
  };

  // Guardar promoción
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      min_amount: formData.min_amount ? parseFloat(formData.min_amount) : null,
      discount: parseFloat(formData.discount),
    };

    try {
      let response;
      console.log("datos enviados", data)
      if (editId) {
        response = await ProductDataService.updatePromotion(editId, data, token);
        setPromotions(prev => prev.map(p => p.id === editId ? response.data : p));
      } else {
        response = await ProductDataService.createPromotion(data, token);
        setPromotions(prev => [...prev, response.data]);
      }
      closeModal();
    } catch (err) {
      setError('Error al guardar: ' + (err.response?.data?.detail || err.message));
    }
  };

  const openModal = (promo = null) => {
    if (promo) {
      setFormData({
        name: promo.name,
        description: promo.description || '',
        min_amount: promo.min_amount || '',
        discount: promo.discount,
        products: promo.products.map(p => p.id) || [],
      });
      setEditId(promo.id);
    } else {
      setFormData({ name: '', description: '', min_amount: '', discount: '', products: [] });
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const openDetailModal = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPromo(null);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta promoción?')) return;
    try {
      await ProductDataService.deletePromotion(id, token);
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  // Calcular precio con descuento
  const getDiscountedPrice = (price, discount) => {
    const discounted = price * (1 - discount / 100);
    return discounted.toFixed(2);
  };

  // Calcular precio total de un producto
  const calculateTotalPrice = (product) => {
    if (product.product_type && product.product_type.base_price !== undefined && product.additional_price !== undefined) {
      return parseFloat(product.product_type.base_price) + parseFloat(product.additional_price);
    }
    return 0; // Valor por defecto si no hay datos suficientes
  };

  // Obtener precios de los productos de una promoción
  const getPromotionPrices = (promo) => {
    if (!promo.products || promo.products.length === 0) return 'N/A';
    const prices = promo.products.map(p => (p.total_price || calculateTotalPrice(p)).toFixed(2));
    return prices.join(', ₡');
  };

  return (
    <div className="promociones-container">
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="hero-section"
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Gestión de Promociones</h1>
          <p>Crea y administra ofertas irresistibles para tus clientes</p>
        </div>
      </motion.section>

      {/* Botón Agregar + Tabla CRUD */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-jsport-blue">Todas las Promociones</h2>
            <button onClick={() => openModal()} className="btn-add">
              <Plus className="mr-2" /> Nueva Promoción
            </button>
          </div>

          {isLoading ? (
            <p className="text-center py-8">Cargando promociones...</p>
          ) : error ? (
            <p className="text-red-600 text-center">{error}</p>
          ) : promotions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No hay promociones creadas.</p>
          ) : (
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="w-full bg-white">
                <thead className="bg-jsport-blue text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Nombre</th>
                    <th className="px-6 py-4 text-center">Descuento</th>
                    <th className="px-6 py-4 text-center">Mínimo</th>
                    <th className="px-6 py-4 text-center">Productos</th>
                    <th className="px-6 py-4 text-center">Precios</th> {/* Nueva columna para precios */}
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promo) => (
                    <tr key={promo.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{promo.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {promo.discount}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        ₡{promo.min_amount || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {promo.products?.length || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        ₡{getPromotionPrices(promo)}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => openModal(promo)}
                          className="btn-edit text-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="btn-delete text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Tarjetas de Promociones con Productos Detallados */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-jsport-blue">
            Ofertas Activas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo, index) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="promo-card-modern"
                onClick={() => openDetailModal(promo)}
              >
                <div className="promo-header">
                  <h3>{promo.name}</h3>
                  <span className="discount-badge">-{promo.discount}%</span>
                </div>
                <p className="promo-desc">{promo.description || 'Oferta especial'}</p>
                <div className="promo-info">
                  <span> Cantidad mínima: {promo.min_amount || 'Sin mínimo'}</span>
                </div>

                <div className="products-grid">
                  {promo.products && promo.products.length > 0 ? (
                    promo.products.map((product) => {
                      const totalPrice = product.total_price || calculateTotalPrice(product);
                      const discountedPrice = getDiscountedPrice(totalPrice, promo.discount);
                      return (
                        <div key={product.id} className="product-item">
                          {product.design_file ? (
                            <img src={product.design_file} alt={product.name} className="product-img" />
                          ) : (
                            <div className="product-placeholder">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          <div className="product-details">
                            <h4>{product.name}</h4>
                            <div className="price-container">
                              <span className="old-price">₡{totalPrice.toFixed(2)}</span>
                              <span className="new-price">₡{discountedPrice}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center col-span-2">Sin productos</p>
                  )}
                </div>

                <div className="promo-actions">
                  <button className="btn-view">
                    Ver Detalle <ChevronRight className="h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal (para crear/editar o ver detalles) */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el backdrop
          >
            {selectedPromo ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-jsport-blue">Detalles de {selectedPromo.name}</h2>
                <p className="mb-4">Descripción: {selectedPromo.description || 'Sin descripción'}</p>
                <p className="mb-4">Descuento: {selectedPromo.discount}%</p>
                <p className="mb-4">Cantidad mínima: {selectedPromo.min_amount || 'Sin mínimo'}</p>
                <h3 className="text-xl font-semibold mb-2">Productos:</h3>
                <div className="products-grid mb-4">
                  {selectedPromo.products.map((product) => {
                    const totalPrice = product.total_price || calculateTotalPrice(product);
                    const discountedPrice = getDiscountedPrice(totalPrice, selectedPromo.discount);
                    return (
                      <div key={product.id} className="product-item">
                        {product.design_file ? (
                          <img src={product.design_file} alt={product.name} className="product-img" />
                        ) : (
                          <div className="product-placeholder">
                            <Image className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="product-details">
                          <h4>{product.name}</h4>
                          <div className="price-container">
                            <span className="old-price">₡{totalPrice.toFixed(2)}</span>
                            <span className="new-price">₡{discountedPrice}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={closeModal} className="btn-cancel">Cerrar</button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  {editId ? 'Editar' : 'Crear'} Promoción
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                    className="w-full"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    rows="3"
                    className="w-full"
                  />
                  <input
                    type="number"
                    name="min_amount"
                    value={formData.min_amount}
                    onChange={handleChange}
                    placeholder="Monto mínimo"
                    step="0.01"
                    className="w-full"
                  />
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="Descuento (%)"
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full"
                  />
                  <select
                    multiple
                    value={formData.products}
                    onChange={handleProductsChange}
                    className="w-full h-32"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₡{calculateTotalPrice(p).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-end gap-3 mt-6">
                    <button type="submit" className="btn-save">Guardar</button>
                    <button type="button" onClick={closeModal} className="btn-cancel">Cancelar</button>
                  </div>
                </form>
              </>
            )}
            {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PromocionesAdmin;