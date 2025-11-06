import React, { useState } from 'react';
import { deleteProduct } from '../utils/api';
import { exportProductsToCSV } from '../utils/csvExport';

const ProductTable = ({ products, setProducts, token, isAuthorized, onSelect, onEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [previewProductId, setPreviewProductId] = useState(null);

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
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleRowClick = (product) => {
    setPreviewProductId(previewProductId === product.id ? null : product.id);
    onSelect(product);
  };

  return (
    <div className="card">
      {isAuthorized && (
        <button
          onClick={() => exportProductsToCSV(products)}
          className="btn btn-export"
        >
          Descargar Lista de Productos (CSV)
        </button>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => sortData('name')} style={{ cursor: 'pointer' }}>
                Nombre {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('product_type')} style={{ cursor: 'pointer' }}>
                Tipo {sortConfig.key === 'product_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('additional_price')} style={{ cursor: 'pointer' }}>
                Precio Adicional {sortConfig.key === 'additional_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Características</th>
              <th>Vista Previa</th>
              {isAuthorized && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr
                key={product.id}
                onClick={() => handleRowClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <td>{product.name}</td>
                <td>{product.product_type?.name || 'N/A'}</td>
                <td>₡{product.additional_price}</td>
                <td>{product.characteristics.map(c => c.name).join(', ') || 'N/A'}</td>
                <td>
                  {product.design_file && (
                    <img
                      src={product.design_file}
                      alt={`Vista previa de ${product.name}`}
                      style={{
                        height: '48px',
                        width: '48px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid var(--border)'
                      }}
                    />
                  )}
                </td>
                {isAuthorized && (
                  <td>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                      className="btn btn-warning"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                      className="btn btn-danger"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;