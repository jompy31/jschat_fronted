import React from 'react';
import FileDataService from '../../../../services/files';
import { motion } from 'framer-motion';

const FileUpload = ({
  selectedFile,
  setSelectedFile,
  fileName,
  setFileName,
  selectedFileName,
  setSelectedFileName,
  files,
  fetchFiles,
  token,
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
    setSelectedFileName('');
  };

  const handleFileNameChange = (event) => {
    setSelectedFileName(event.target.value);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.log('Ningún archivo seleccionado');
      return;
    }

    if (!selectedFileName) {
      console.log('Por favor ingrese un nombre de archivo');
      return;
    }

    const existingFile = files.find(file => file.name === selectedFileName);
    if (existingFile) {
      const confirmOverwrite = window.confirm('El archivo ya existe. ¿Quieres sobreescribirlo?');
      if (!confirmOverwrite) {
        return;
      }
      FileDataService.deleteFile(existingFile.id, token)
        .then(() => fetchFiles())
        .catch(error => console.error('Error al eliminar el archivo:', error));
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', selectedFileName);

    FileDataService.uploadFile(formData, token)
      .then(response => {
        console.log('Documento cargado exitosamente:', response.data);
        fetchFiles();
        setSelectedFile(null);
        setFileName('');
        setSelectedFileName('');
      })
      .catch(error => {
        console.error('Error al cargar el archivo:', error);
      });
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4"
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full sm:w-auto p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <input
          type="text"
          placeholder="Ingrese el nombre del archivo"
          value={selectedFileName}
          onChange={handleFileNameChange}
          className="w-full sm:w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Cargar archivo
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FileUpload;