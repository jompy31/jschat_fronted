import React, { useState } from 'react';
import { createProductType, updateProductType } from '../utils/api';

const CreateProductTypeForm = ({ onClose, token, setProductTypes, editingProductType }) => {
  const [formData, setFormData] = useState({
    name: editingProductType?.name || '',
    description: editingProductType?.description || '',
    base_price: editingProductType?.base_price || 0,
    delivery_time_days: editingProductType?.delivery_time_days || 1,
    daily_production_capacity: editingProductType?.daily_production_capacity || 100,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, created_by_id: 1 }; // Adjust user ID as needed
    try {
      if (editingProductType) {
        const response = await updateProductType(editingProductType.id, data, token);
        setProductTypes(prev => prev.map(t => (t.id === editingProductType.id ? response.data : t)));
      } else {
        const response = await createProductType(data, token);
        setProductTypes(prev => [...prev, response.data]);
      }
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          {editingProductType ? 'Editar Tipo de Producto' : 'Crear Tipo de Producto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Precio Base</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Tiempo de Entrega (días)</label>
            <input
              type="number"
              name="delivery_time_days"
              value={formData.delivery_time_days}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Capacidad Diaria</label>
            <input
              type="number"
              name="daily_production_capacity"
              value={formData.daily_production_capacity}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              min="1"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CreateProductTypeForm;