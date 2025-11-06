import React, { useState, useEffect } from 'react';
import ProductTypeTable from './components/ProductTypeTable';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import CreateProductTypeForm from './components/CreateProductTypeForm';
import CreateProductForm from './components/CreateProductForm';
import CreateCharacteristicForm from './components/CreateCharacteristicForm';
import { fetchProductTypes, fetchProducts, fetchCharacteristics } from './utils/api';
import "./components/products.css";

// Íconos simples con SVG
const TabIcon = ({ type }) => {
  switch (type) {
    case 'types':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
    case 'products':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    case 'characteristics':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default:
      return null;
  }
};

const Products = () => {
  const [activeTab, setActiveTab] = useState('types');
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

  const isAuthorized = user?.userprofile?.staff_status && ['administrator', 'sales', 'design'].includes(user.userprofile.staff_status);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        setError('Error al cargar datos del usuario');
      }
    } else {
      setError('No se encontró usuario autenticado. Inicia sesión.');
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
    if (!isAuthorized) return alert('No tienes permiso.');
    setEditingProductType(type);
    setShowProductTypeForm(true);
  };

  const handleOpenProductForm = (product = null) => {
    if (!isAuthorized) return alert('No tienes permiso.');
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleOpenCharacteristicForm = (char = null) => {
    if (!isAuthorized) return alert('No tienes permiso.');
    setEditingCharacteristic(char);
    setShowCharacteristicForm(true);
  };

  const tabs = [
    { id: 'types', label: 'Tipos de Producto', icon: 'types' },
    { id: 'products', label: 'Productos', icon: 'products' },
    { id: 'characteristics', label: 'Características', icon: 'characteristics' },
  ];

  return (
    <div className="products-container">
      <div className="products-content">
        <h1 className="products-title">Gestión de Productos</h1>
        {error && <p className="text-red-500 text-center mb-6 font-medium">{error}</p>}

        {/* Tabs */}
        <div className="tabs-container mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'tab-active' : ''}`}
            >
              <TabIcon type={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de pestañas */}
        <div className="tab-content">
          {/* Pestaña: Tipos de Producto */}
          {activeTab === 'types' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-5">
                <h2 className="section-title">Tipos de Productos</h2>
                {isAuthorized && (
                  <button onClick={() => handleOpenProductTypeForm()} className="btn btn-primary">
                    + Crear Tipo
                  </button>
                )}
              </div>
              <div className="card">
                <ProductTypeTable
                  productTypes={productTypes}
                  setProductTypes={setProductTypes}
                  token={token}
                  isAuthorized={isAuthorized}
                  onEdit={handleOpenProductTypeForm}
                />
              </div>
            </div>
          )}

          {/* Pestaña: Productos */}
          {activeTab === 'products' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-5">
                <h2 className="section-title">Productos</h2>
                {isAuthorized && (
                  <div className="flex gap-3">
                    <button onClick={() => handleOpenProductForm()} className="btn btn-primary">
                      + Crear Producto
                    </button>
                    <button onClick={() => handleOpenCharacteristicForm()} className="btn btn-secondary">
                      + Característica
                    </button>
                  </div>
                )}
              </div>
              <div className="card">
                <ProductTable
                  products={products}
                  setProducts={setProducts}
                  token={token}
                  isAuthorized={isAuthorized}
                  onSelect={handleSelectProduct}
                  onEdit={handleOpenProductForm}
                />
              </div>
            </div>
          )}

          {/* Pestaña: Características */}
          {activeTab === 'characteristics' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-5">
                <h2 className="section-title">Características</h2>
                {isAuthorized && (
                  <button onClick={() => handleOpenCharacteristicForm()} className="btn btn-primary">
                    + Crear Característica
                  </button>
                )}
              </div>
              <div className="card">
                {!Array.isArray(characteristics) || characteristics.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No hay características disponibles.</p>
                ) : (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          {isAuthorized && <th>Acciones</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {characteristics.map(char => (
                          <tr key={char.id}>
                            <td>{char.name}</td>
                            <td>{char.description || 'N/A'}</td>
                            {isAuthorized && (
                              <td>
                                <button onClick={() => handleOpenCharacteristicForm(char)} className="btn btn-warning text-sm">
                                  Editar
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modales */}
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