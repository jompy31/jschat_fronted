import React, { useState } from 'react';
import { deleteProduct } from '../utils/api';
import { exportProductsToCSV } from '../utils/csvExport';

const ProductTable = ({ products, setProducts, token, isAuthorized, onSelect, onEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [previewProductId, setPreviewProductId] = useState(null); // Track which product is being previewed

  const sortData = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    const sorted = [...products].sort((a, b) => {
      if (key === 'product_type') {
        const valA = a.product_type?.name || '';
        const valB = b.product_type?.name || '';
        return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setProducts(sorted);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Confirmar eliminación del producto?')) return;
    try {
      await deleteProduct(id, token);
      setProducts(products.filter(product => product.id !== id));
      alert('Producto eliminado con éxito.');
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleRowClick = (product) => {
    // Toggle preview if clicking the same product, otherwise show new preview
    setPreviewProductId(previewProductId === product.id ? null : product.id);
    onSelect(product); // Open modal with full details
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
      {isAuthorized && (
        <button
          onClick={() => exportProductsToCSV(products)}
          className="mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Descargar Lista de Productos (CSV)
        </button>
      )}
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <th className="p-3 cursor-pointer" onClick={() => sortData('name')}>
              Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-3 cursor-pointer" onClick={() => sortData('product_type')}>
              Tipo {sortConfig.key === 'product_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-3 cursor-pointer" onClick={() => sortData('additional_price')}>
              Precio Adicional {sortConfig.key === 'additional_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="p-3">Características</th>
            <th className="p-3">Vista Previa</th>
            {isAuthorized && <th className="p-3">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <React.Fragment key={product.id}>
              <tr
                className="border-b border-gray-700 hover:bg-gray-700 transition-all cursor-pointer"
                onClick={() => handleRowClick(product)}
              >
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.product_type?.name || 'N/A'}</td>
                <td className="p-3">₡{product.additional_price}</td>
                <td className="p-3">{product.characteristics.map(c => c.name).join(', ') || 'N/A'}</td>
                <td className="p-3">
                  {product.design_file && (
                    <img
                      src={product.design_file}
                      alt={`Vista previa de ${product.name}`}
                      className="h-12 w-12 object-cover rounded"
                    />
                  )}
                </td>
                {isAuthorized && (
                  <td className="p-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;