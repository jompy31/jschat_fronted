import React, { useState } from 'react';
import { deleteProductType } from '../utils/api';

const ProductTypeTable = ({ productTypes, setProductTypes, token, isAuthorized, onEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const sortData = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    if (!Array.isArray(productTypes)) return;
    const sorted = [...productTypes].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setProductTypes(sorted);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Confirmar eliminación del tipo de producto?')) return;
    try {
      await deleteProductType(id, token);
      setProductTypes(productTypes.filter(type => type.id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg p-6">
      {!Array.isArray(productTypes) || productTypes.length === 0 ? (
        <p className="text-white text-center">No hay tipos de productos disponibles.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <th className="p-3 cursor-pointer" onClick={() => sortData('name')}>
                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => sortData('base_price')}>
                Precio Base {sortConfig.key === 'base_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => sortData('delivery_time_days')}>
                Tiempo de Entrega {sortConfig.key === 'delivery_time_days' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-3 cursor-pointer" onClick={() => sortData('daily_production_capacity')}>
                Capacidad Diaria {sortConfig.key === 'daily_production_capacity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              {isAuthorized && <th className="p-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productTypes.map(type => (
              <tr key={type.id} className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                <td className="p-3">{type.name}</td>
                <td className="p-3">₡{type.base_price}</td>
                <td className="p-3">{type.delivery_time_days} días</td>
                <td className="p-3">{type.daily_production_capacity}</td>
                {isAuthorized && (
                  <td className="p-3">
                    <button
                      onClick={() => onEdit(type)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
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
  );
};

export default ProductTypeTable;