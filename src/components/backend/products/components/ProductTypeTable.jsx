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
    <div className="table-container">
      {!Array.isArray(productTypes) || productTypes.length === 0 ? (
        <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
          No hay tipos de productos disponibles.
        </p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => sortData('name')} style={{ cursor: 'pointer' }}>
                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('base_price')} style={{ cursor: 'pointer' }}>
                Precio Base {sortConfig.key === 'base_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('delivery_time_days')} style={{ cursor: 'pointer' }}>
                Tiempo de Entrega {sortConfig.key === 'delivery_time_days' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('daily_production_capacity')} style={{ cursor: 'pointer' }}>
                Capacidad Diaria {sortConfig.key === 'daily_production_capacity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              {isAuthorized && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productTypes.map(type => (
              <tr key={type.id}>
                <td>{type.name}</td>
                <td>₡{type.base_price}</td>
                <td>{type.delivery_time_days} días</td>
                <td>{type.daily_production_capacity}</td>
                {isAuthorized && (
                  <td>
                    <button onClick={() => onEdit(type)} className="btn btn-warning">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(type.id)} className="btn btn-danger">
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