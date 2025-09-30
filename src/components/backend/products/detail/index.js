import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import { fetchProducts } from '../utils/api';

const ProductDetail = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check if user is authorized based on staff_status
  const isAuthorized = user?.userprofile?.staff_status && ['administrator', 'sales', 'design'].includes(user.userprofile.staff_status);

  useEffect(() => {
    // Retrieve user and token from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        setError('Error al cargar datos del usuario desde localStorage');
      }
    } else {
      setError('No se encontró usuario autenticado. Por favor, inicia sesión.');
    }
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!token || !productId) return;
      try {
        const response = await fetchProducts(token);
        const foundProduct = response.data.find(p => p.id === parseInt(productId));
        if (foundProduct) setProduct(foundProduct);
        else setError('Producto no encontrado');
      } catch (err) {
        setError('Error al cargar el producto: ' + err.message);
      }
    };
    if (token && productId) loadProduct();
  }, [token, productId]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!product) return <p className="text-white text-center">Cargando...</p>;

  return (
    <ProductModal
      product={product}
      onClose={() => window.history.back()}
      token={token}
      setProducts={() => {}} // Not needed in detail view
      characteristics={[]}
      isAuthorized={isAuthorized}
    />
  );
};

export default ProductDetail;