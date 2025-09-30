import React, { useState } from 'react';
import { createCharacteristic, updateCharacteristic, deleteCharacteristic } from '../utils/api';

const CreateCharacteristicForm = ({ onClose, token, setCharacteristics, editingCharacteristic }) => {
  const [formData, setFormData] = useState({
    name: editingCharacteristic?.name || '',
    description: editingCharacteristic?.description || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCharacteristic) {
        const response = await updateCharacteristic(editingCharacteristic.id, formData, token);
        setCharacteristics(prev => prev.map(c => (c.id === editingCharacteristic.id ? response.data : c)));
      } else {
        const response = await createCharacteristic(formData, token);
        setCharacteristics(prev => [...prev, response.data]);
      }
      onClose();
    } catch (err) {
      alert('Error al guardar característica: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!editingCharacteristic) return;
    if (!window.confirm('¿Confirmar eliminación de la característica?')) return;
    try {
      await deleteCharacteristic(editingCharacteristic.id, token);
      setCharacteristics(prev => prev.filter(c => c.id !== editingCharacteristic.id));
      onClose();
    } catch (err) {
      alert('Error al eliminar característica: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          {editingCharacteristic ? 'Editar Característica' : 'Crear Característica'}
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
          <div className="flex justify-between space-x-4">
            {editingCharacteristic && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
              >
                Eliminar
              </button>
            )}
            <div className="flex space-x-4">
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

export default CreateCharacteristicForm;