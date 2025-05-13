import React, { useState, useEffect } from 'react';
import { createCharacteristic, updateCharacteristic } from '../utils/api';

const CharacteristicModal = ({ show, onHide, mode, characteristic, token, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (mode === 'edit' && characteristic) {
      setFormData({ name: characteristic.name, description: characteristic.description });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [mode, characteristic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        await createCharacteristic(formData, token);
      } else {
        await updateCharacteristic(characteristic.id, formData);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} characteristic:`, error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`} style={{marginTop:"6%"}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Crear Característica' : 'Editar Característica'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition" onClick={onHide}>
            Cancelar
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" onClick={handleSubmit}>
            {mode === 'create' ? 'Crear' : 'Guardar los cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacteristicModal;