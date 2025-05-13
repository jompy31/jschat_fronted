import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductDataService from '../../../services/products';
import TableComponent from './components/TableComponent';
import ProductModal from './components/ProductModal';
import CharacteristicModal from './components/CharacteristicModal';
import { getAllProducts, getAllCharacteristics, getUserList, getAllServices } from './utils/api';
import { formatDate } from './utils/format';
import './file_products.css';

const CharacteristicsTable = ({ token: propToken, user }) => {
  const [products, setProducts] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [services, setServices] = useState([]);
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCharacteristicModal, setShowCharacteristicModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState(null);
  const token = useSelector((state) => state.authentication.token) || propToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, characteristicsData, servicesData] = await Promise.all([
          getAllProducts(),
          getAllCharacteristics(),
          getAllServices(),
        ]);
        setProducts(productsData);
        setCharacteristics(characteristicsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (token) {
      getUserList(token)
        .then((users) => setUserList(users))
        .catch((error) => console.error('Error fetching users:', error));
    }
  }, [token]);

  useEffect(() => {
    if (userList.length > 0 && user) {
      const foundUser = userList.find((u) => u.email === user);
      setCurrentUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    }
  }, [userList, user]);

  const productColumns = [
    { header: 'Nombre del producto', accessor: 'name' },
    {
      header: 'Visualización',
      render: (product) => (
        <div className="flex gap-2">
          {product.file && (
            <img src={product.file} alt="Vista previa" className="w-16 h-16 object-cover rounded" />
          )}
          {product.file1 && (
            <img src={product.file1} alt="Vista previa" className="w-16 h-16 object-cover rounded" />
          )}
        </div>
      ),
    },
    {
      header: 'Características',
      render: (product) => product.characteristics.map((char) => (
        <div key={char.id} className="text-sm">
          <strong>{char.name}</strong>: {char.description}
        </div>
      )),
    },
    { header: 'Descripción', accessor: 'description' },
    { header: 'Creado por', accessor: 'user' },
    { header: 'Creado en', render: (product) => formatDate(product.created_at) },
    {
      header: 'Acciones',
      render: (product) => (
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" onClick={() => handleEditProduct(product)}>Editar</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
        </div>
      ),
    },
  ];

  const characteristicColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'name' },
    { header: 'Descripción', accessor: 'description' },
    {
      header: 'Acciones',
      render: (char) => (
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" onClick={() => handleEditCharacteristic(char)}>Editar</button>
          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onClick={() => handleDeleteCharacteristic(char.id)}>Eliminar</button>
        </div>
      ),
    },
  ];

  const handleCreateProduct = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await ProductDataService.deleteProduct(id, token);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCreateCharacteristic = () => {
    setModalMode('create');
    setSelectedCharacteristic(null);
    setShowCharacteristicModal(true);
  };

  const handleEditCharacteristic = (char) => {
    setModalMode('edit');
    setSelectedCharacteristic(char);
    setShowCharacteristicModal(true);
  };

  const handleDeleteCharacteristic = async (id) => {
    try {
      await ProductDataService.deleteCharacteristic(id);
      setCharacteristics(characteristics.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting characteristic:', error);
    }
  };

  return (
    <div className="container mx-auto p-6" style={{marginTop:"6%"}}>
      <h1 className="text-3xl font-bold mb-6">Archivos de página Servicios</h1>
      <button className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600 transition" onClick={handleCreateProduct}>
        Crear un Servicio
      </button>
      <TableComponent columns={productColumns} data={products} itemsPerPage={4} />
      <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 mb-4 hover:bg-green-600 transition" onClick={handleCreateCharacteristic}>
        Crear Característica
      </button>
      <TableComponent columns={characteristicColumns} data={characteristics} itemsPerPage={4} />
      <ProductModal
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        mode={modalMode}
        product={selectedProduct}
        characteristics={characteristics}
        services={services}
        token={token}
        onSave={() => getAllProducts().then(setProducts)}
      />
      <CharacteristicModal
        show={showCharacteristicModal}
        onHide={() => setShowCharacteristicModal(false)}
        mode={modalMode}
        characteristic={selectedCharacteristic}
        token={token}
        onSave={() => getAllCharacteristics().then(setCharacteristics)}
      />
    </div>
  );
};

export default CharacteristicsTable;