import React, { useState, useEffect } from 'react';
import ProductTypeTable from './components/ProductTypeTable';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import CreateProductTypeForm from './components/CreateProductTypeForm';
import CreateProductForm from './components/CreateProductForm';
import CreateCharacteristicForm from './components/CreateCharacteristicForm';
import { fetchProductTypes, fetchProducts, fetchCharacteristics } from './utils/api';

const Products = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductTypeForm, setShowProductTypeForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCharacteristicForm, setShowCharacteristicForm] = useState(false);
  const [editingProductType, setEditingProductType] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCharacteristic, setEditingCharacteristic] = useState(null);
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
    const loadData = async () => {
      if (!token) return;
      try {
        const [types, prods, chars] = await Promise.all([
          fetchProductTypes(token),
          fetchProducts(token),
          fetchCharacteristics(token),
        ]);
        setProductTypes(Array.isArray(types.data) ? types.data : []);
        setProducts(Array.isArray(prods.data) ? prods.data : []);
        setCharacteristics(Array.isArray(chars.data) ? chars.data : []);
      } catch (err) {
        setError('Error al cargar datos: ' + err.message);
      }
    };
    if (token) loadData();
  }, [token]);

  const handleSelectProduct = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);
  const handleOpenProductTypeForm = (type = null) => {
    if (!isAuthorized) return alert('No tienes permiso para realizar esta acción.');
    setEditingProductType(type);
    setShowProductTypeForm(true);
  };
  const handleOpenProductForm = (product = null) => {
    if (!isAuthorized) return alert('No tienes permiso para realizar esta acción.');
    setEditingProduct(product);
    setShowProductForm(true);
  };
  const handleOpenCharacteristicForm = (char = null) => {
    if (!isAuthorized) return alert('No tienes permiso para realizar esta acción.');
    setEditingCharacteristic(char);
    setShowCharacteristicForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Gestión de Productos
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Product Types Table */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Tipos de Productos</h2>
            {isAuthorized && (
              <button
                onClick={() => handleOpenProductTypeForm()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Crear Tipo de Producto
              </button>
            )}
          </div>
          <ProductTypeTable
            productTypes={productTypes}
            setProductTypes={setProductTypes}
            token={token}
            isAuthorized={isAuthorized}
            onEdit={handleOpenProductTypeForm}
          />
        </div>

        {/* Products Table */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Productos</h2>
            {isAuthorized && (
              <div className="space-x-4">
                <button
                  onClick={() => handleOpenProductForm()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Crear Producto
                </button>
                <button
                  onClick={() => handleOpenCharacteristicForm()}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Crear Característica
                </button>
              </div>
            )}
          </div>
          <ProductTable
            products={products}
            setProducts={setProducts}
            token={token}
            isAuthorized={isAuthorized}
            onSelect={handleSelectProduct}
            onEdit={handleOpenProductForm}
          />
        </div>

        {/* Characteristics Table */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Características</h2>
          <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
            {!Array.isArray(characteristics) || characteristics.length === 0 ? (
              <p className="text-white text-center">No hay características disponibles.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Descripción</th>
                    {isAuthorized && <th className="p-3">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {characteristics.map(char => (
                    <tr key={char.id} className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                      <td className="p-3">{char.name}</td>
                      <td className="p-3">{char.description || 'N/A'}</td>
                      {isAuthorized && (
                        <td className="p-3">
                          <button
                            onClick={() => handleOpenCharacteristicForm(char)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleOpenCharacteristicForm(char)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modals */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={handleCloseModal}
            token={token}
            setProducts={setProducts}
            characteristics={characteristics}
            productTypes={productTypes}
            isAuthorized={isAuthorized}
          />
        )}
        {showProductTypeForm && (
          <CreateProductTypeForm
            onClose={() => setShowProductTypeForm(false)}
            token={token}
            setProductTypes={setProductTypes}
            editingProductType={editingProductType}
          />
        )}
        {showProductForm && (
          <CreateProductForm
            onClose={() => setShowProductForm(false)}
            token={token}
            setProducts={setProducts}
            productTypes={productTypes}
            characteristics={characteristics}
            editingProduct={editingProduct}
          />
        )}
        {showCharacteristicForm && (
          <CreateCharacteristicForm
            onClose={() => setShowCharacteristicForm(false)}
            token={token}
            setCharacteristics={setCharacteristics}
            editingCharacteristic={editingCharacteristic}
          />
        )}
      </div>
    </div>
  );
};

export default Products;