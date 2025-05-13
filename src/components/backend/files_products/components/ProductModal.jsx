import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../utils/api';

const ProductModal = ({ show, onHide, mode, product, characteristics, token, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    name_url: '',
    description: '',
    file: null,
    file1: null,
    characteristics: [],
  });

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name,
        name_url: product.name_url,
        description: product.description,
        file: null,
        file1: null,
        characteristics: product.characteristics,
      });
    } else {
      setFormData({
        name: '',
        name_url: '',
        description: '',
        file: null,
        file1: null,
        characteristics: [],
      });
    }
  }, [mode, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
  };

  const handleCharacteristicsSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => JSON.parse(option.value));
    setFormData((prev) => ({ ...prev, characteristics: selectedOptions }));
  };

  const handleCharacteristicsDoubleClick = () => {
    setFormData((prev) => ({ ...prev, characteristics: [] }));
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('name_url', formData.name_url);
    data.append('description', formData.description);
    if (formData.file) data.append('file', formData.file);
    if (formData.file1) data.append('file1', formData.file1);
    formData.characteristics.forEach((char) => data.append('characteristics', char.id));

    try {
      if (mode === 'create') {
        await createProduct(data, token);
      } else {
        data.append('id', product.id);
        await updateProduct(product.id, data, token);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} product:`, error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${show ? 'block' : 'hidden'}`} style={{marginTop:"6%"}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Crear Servicios' : 'Editar Servicio'}</h2>
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
            <label className="block text-sm font-medium text-gray-700">URL</label>
            <input
              type="text"
              name="name_url"
              value={formData.name_url}
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Archivo</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Archivo característica</label>
            <input
              type="file"
              name="file1"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Características</label>
            <select
              multiple
              value={formData.characteristics.map((char) => JSON.stringify(char))}
              onChange={handleCharacteristicsSelection}
              onDoubleClick={handleCharacteristicsDoubleClick}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-48 focus:ring-blue-500 focus:border-blue-500"
            >
              {characteristics.map((char, index) => (
                <option
                  key={char.id}
                  value={JSON.stringify(char)}
                  disabled={formData.characteristics.some((selectedChar) => selectedChar.id === char.id)}
                >
                  {index + 1}. {char.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition" onClick={onHide}>
            Cancelar
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" onClick={handleSubmit}>
            {mode === 'create' ? 'Crear' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;