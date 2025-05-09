import React from 'react';
import FileDataService from '../../../../services/files';
import { motion } from 'framer-motion';

const DesignUpload = ({
  selectedDesignFile,
  setSelectedDesignFile,
  designName,
  setDesignName,
  designUrl,
  setDesignUrl,
  designCustomer,
  setDesignCustomer,
  designContext,
  setDesignContext,
  fetchDesigns,
  token,
  selectedDesigns,
  setSelectedDesigns,
}) => {
  const handleDesignFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedDesignFile(file);
  };

  const handleDesignNameChange = (event) => {
    setDesignName(event.target.value);
  };

  const handleDesignUrlChange = (event) => {
    setDesignUrl(event.target.value);
  };

  const handleDesignCustomerChange = (event) => {
    setDesignCustomer(event.target.value);
  };

  const handleDesignContextChange = (event) => {
    setDesignContext(event.target.value);
  };

  const handleUploadDesign = () => {
    if (!selectedDesignFile) {
      console.log('Ningún archivo de diseño seleccionado');
      return;
    }

    if (!designName || !designUrl || !designCustomer || !designContext) {
      console.log('Por favor, complete todos los campos para el diseño');
      return;
    }

    const formData = new FormData();
    formData.append('name', designName);
    formData.append('url', designUrl);
    formData.append('image', selectedDesignFile);
    formData.append('customer', designCustomer);
    formData.append('context', designContext);

    FileDataService.createDesign(formData, token)
      .then(response => {
        console.log('Diseño cargado exitosamente:', response.data);
        fetchDesigns();
        setSelectedDesignFile(null);
        setDesignName('');
        setDesignUrl('');
        setDesignCustomer('');
        setDesignContext('');
        setSelectedDesigns([...selectedDesigns, response.data.id]);
      })
      .catch(error => {
        console.error('Error al cargar el diseño:', error);
      });
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <input
          type="file"
          onChange={handleDesignFileChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <input
          type="text"
          placeholder="Ingrese el nombre del diseño"
          value={designName}
          onChange={handleDesignNameChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <input
          type="text"
          placeholder="Ingrese el cliente"
          value={designCustomer}
          onChange={handleDesignCustomerChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <input
          type="text"
          placeholder="Ingrese la URL del diseño"
          value={designUrl}
          onChange={handleDesignUrlChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <textarea
          placeholder="Ingrese el contexto del diseño"
          value={designContext}
          onChange={handleDesignContextChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 resize-none"
          rows="4"
        />
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUploadDesign}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 w-full sm:w-auto"
      >
        Cargar diseño
      </motion.button>
    </div>
  );
};

export default DesignUpload;