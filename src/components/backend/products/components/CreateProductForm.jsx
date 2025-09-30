import React, { useState } from 'react';
import { createProduct, updateProduct } from '../utils/api';

const CreateProductForm = ({ onClose, token, setProducts, productTypes, characteristics, editingProduct }) => {
  const [formData, setFormData] = useState({
    name: editingProduct?.name || '',
    description: editingProduct?.description || '',
    product_type_id: editingProduct?.product_type?.id || '',
    additional_price: editingProduct?.additional_price || 0,
    design_file: null,
    characteristic_ids: editingProduct?.characteristics?.map(c => c.id.toString()) || [],
  });
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Validación de archivo
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!file) return { valid: true }; // No file selected is valid
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}` };
    }
    if (file.size > maxSize) {
      return { valid: false, error: `El archivo excede el límite de ${maxSize / (1024 * 1024)}MB` };
    }
    return { valid: true };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    console.log('Archivo seleccionado:', file ? { name: file.name, type: file.type, size: file.size } : null);
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error);
        setFormData({ ...formData, design_file: null });
        setPreviewUrl(null);
        return;
      }
      // Crear URL para vista previa si es una imagen
      if (file.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
    setFormData({ ...formData, design_file: file });
  };

  const handleCharacteristicChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData({ ...formData, characteristic_ids: options });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user?.id) {
      setError('No se encontró usuario autenticado.');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description || '');
    data.append('product_type_id', formData.product_type_id);
    data.append('additional_price', parseFloat(formData.additional_price).toFixed(2));
    data.append('created_by_id', user.id);

    // Manejo de design_file
    if (formData.design_file instanceof File) {
      console.log('Agregando archivo al FormData:', { name: formData.design_file.name, type: formData.design_file.type, size: formData.design_file.size });
      data.append('design_file', formData.design_file);
    } else if (!editingProduct) {
      console.log('No se seleccionó archivo, enviando design_file como vacío');
      data.append('design_file', '');
    } else {
      console.log('Editando producto, omitiendo design_file para mantener el archivo existente');
    }

    // Enviar cada characteristic_id como un valor individual en el FormData
    formData.characteristic_ids.forEach(id => {
      data.append('characteristic_ids', id);
    });

    // Depuración: Mostrar contenido del FormData
    console.log('Enviando FormData:');
    for (let [key, value] of data.entries()) {
      console.log(`FormData - ${key}:`, value instanceof File ? { name: value.name, type: value.type, size: value.size } : value);
    }

    try {
      if (editingProduct) {
        console.log('Enviando solicitud PUT para actualizar producto:', editingProduct.id);
        const response = await updateProduct(editingProduct.id, data, token);
        setProducts(prev => prev.map(p => (p.id === editingProduct.id ? response.data : p)));
      } else {
        console.log('Enviando solicitud POST para crear producto');
        const response = await createProduct(data, token);
        setProducts(prev => [...prev, response.data]);
      }
      // Limpiar URL de vista previa
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      onClose();
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = 'Error al guardar producto';
      if (errorData) {
        if (typeof errorData === 'object' && !errorData.detail) {
          const fieldErrors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          errorMsg = fieldErrors || 'Error al guardar producto';
        } else {
          errorMsg = errorData.detail || err.message;
        }
      }
      setError(errorMsg);
      console.error('Error al enviar solicitud:', err.response || err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          {editingProduct ? 'Editar Producto' : 'Crear Producto'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
            <label className="block text-white mb-1">Tipo de Producto</label>
            <select
              name="product_type_id"
              value={formData.product_type_id}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              required
            >
              <option value="">Seleccionar tipo</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Precio Adicional</label>
            <input
              type="number"
              name="additional_price"
              value={formData.additional_price}
              onChange={handleInputChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Archivo de Diseño</label>
            <input
              type="file"
              name="design_file"
              onChange={handleFileChange}
              className="w-full bg-gray-800 text-white rounded p-2"
              accept="image/jpeg,image/png,application/pdf"
            />
            {editingProduct && editingProduct.design_file && !formData.design_file && (
              <p className="text-gray-400 text-sm mt-1">
                Archivo actual: {editingProduct.design_file.split('/').pop()}
                {formData.design_file === null && ' (será reemplazado si no se selecciona un nuevo archivo)'}
              </p>
            )}
            {previewUrl && (
              <div className="mt-2">
                <p className="text-gray-400 text-sm">Vista previa:</p>
                <img src={previewUrl} alt="Vista previa" className="max-w-full h-auto rounded" style={{ maxHeight: '200px' }} />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-1">Características</label>
            <select
              multiple
              name="characteristic_ids"
              value={formData.characteristic_ids}
              onChange={handleCharacteristicChange}
              className="w-full bg-gray-800 text-white rounded p-2"
            >
              {characteristics.map(char => (
                <option key={char.id} value={char.id.toString()}>{char.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                onClose();
              }}
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
          onClick={() => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            onClose();
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CreateProductForm;