import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Edit, Trash2 } from 'lucide-react';
import ProductDataService from '../../../../services/products';
import './detail.css';

const PromotionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_amount: '',
    discount: '',
    products: [],
  });
  const token = localStorage.getItem('token');

  // Animations
  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  // Fetch promotion and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promoResponse = await ProductDataService.getPromotionById(id, token);
        setPromotion(promoResponse.data);
        setFormData({
          name: promoResponse.data.name,
          description: promoResponse.data.description || '',
          min_amount: promoResponse.data.min_amount || '',
          discount: promoResponse.data.discount,
          products: promoResponse.data.products,
        });
        const productResponse = await ProductDataService.getAllProducts(token);
        setProducts(productResponse.data.results || productResponse.data);
      } catch (err) {
        setError('Error fetching promotion: ' + (err.response?.data?.detail || err.message));
      }
    };
    if (token) fetchData();
  }, [id, token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle product selection
  const handleProductChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setFormData({ ...formData, products: selected });
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, min_amount: parseFloat(formData.min_amount) || null, discount: parseFloat(formData.discount) };
      await ProductDataService.updatePromotion(id, data, token);
      setPromotion({ ...promotion, ...data });
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Error updating promotion: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await ProductDataService.deletePromotion(id, token);
        navigate('/promociones');
      } catch (err) {
        setError('Error deleting promotion: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  if (!promotion) {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="promociones-container max-w-4xl mx-auto py-16 px-4">
      <motion.div initial="hidden" animate="visible" variants={cardVariants} className="promo-card bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-jsport-blue">{promotion.name}</h1>
        <p className="text-gray-600 mb-4">{promotion.description || 'No description available'}</p>
        <p className="text-sm text-gray-500 mb-4">Descuento: {promotion.discount}%</p>
        <p className="text-sm text-gray-500 mb-4">Compra mínima: ${promotion.min_amount || 'N/A'}</p>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-jsport-blue mb-2">Productos Incluidos</h2>
          <ul className="list-disc list-inside text-gray-600">
            {promotion.products.map((productId) => {
              const product = products.find((p) => p.id === productId);
              return product ? (
                <li key={productId}>
                  {product.name} - ${product.price} {product.image && <img src={product.image} alt={product.name} className="inline-block w-16 h-16 object-cover rounded" />}
                </li>
              ) : (
                <li key={productId}>Producto no encontrado</li>
              );
            })}
          </ul>
        </div>
        <div className="actions flex justify-between">
          <button onClick={() => setIsEditModalOpen(true)} className="btn-edit inline-flex items-center">
            <Edit className="mr-1 h-4 w-4" /> Editar
          </button>
          <button onClick={handleDelete} className="btn-delete inline-flex items-center">
            <Trash2 className="mr-1 h-4 w-4" /> Eliminar
          </button>
        </div>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </motion.div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-jsport-blue">Editar Promoción</h2>
            <form onSubmit={handleSubmit} className="new-promo-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre de la promoción"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="min_amount"
                value={formData.min_amount}
                onChange={handleInputChange}
                placeholder="Monto mínimo"
                step="0.01"
              />
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="Descuento (%)"
                required
                step="0.01"
              />
              <select multiple name="products" value={formData.products} onChange={handleProductChange} className="w-full p-2 border rounded">
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button type="submit" className="btn-save">Guardar</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-cancel">
                  Cancelar
                </button>
              </div>
            </form>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      )}

      <Link to="/promociones" className="mt-6 inline-flex items-center text-jsport-red hover:text-red-600 font-semibold">
        Volver a Promociones <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default PromotionDetail;